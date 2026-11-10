import { db, dbRef, dbSet, dbOnValue, dbServerTimestamp, ready } from "./firebase.js";
import { setupTheme, validRoom, showStatus } from "./common.js";
setupTheme();

const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");
const newBtn = document.getElementById("newBtn");
const editorArea = document.getElementById("editorArea");
const editor = document.getElementById("editor");
const connection = document.getElementById("connection");
const syncStatus = document.getElementById("syncStatus");
const roomLabel = document.getElementById("roomLabel");
const charCount = document.getElementById("charCount");
let currentRoom = null;
let unsubscribe = null;
let debounceTimer = null;
let applyingRemote = false;
let lastLocalText = "";

function makeRoom() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
async function joinRoom(room) {
  if (!validRoom(room)) return showStatus(connection, "Room ID harus tepat 6 angka.");
  try {
    await ready;
    if (unsubscribe) unsubscribe();
    currentRoom = room;
    roomInput.value = room;
    roomLabel.textContent = room;
    editorArea.classList.remove("hidden");
    editor.disabled = false;
    syncStatus.textContent = "Menghubungkan...";
    showStatus(connection, "Terhubung ke layanan Firebase.", true);
    const textRef = dbRef(db, `rooms/${room}/text`);
    unsubscribe = dbOnValue(textRef, snapshot => {
      const remoteText = snapshot.val() ?? "";
      if (remoteText !== editor.value) {
        applyingRemote = true;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = remoteText;
        editor.setSelectionRange(Math.min(start, remoteText.length), Math.min(end, remoteText.length));
        applyingRemote = false;
      }
      lastLocalText = editor.value;
      charCount.textContent = `${editor.value.length.toLocaleString("id-ID")} / 20.000`;
      syncStatus.textContent = "● Tersinkron langsung";
      syncStatus.className = "text-green-600";
    }, error => {
      syncStatus.textContent = `Gagal membaca data: ${error.message}`;
      syncStatus.className = "text-red-600";
    });
  } catch (err) {
    showStatus(connection, `Gagal terhubung: ${err.message}`);
  }
}
joinBtn.addEventListener("click", () => joinRoom(roomInput.value.trim()));
newBtn.addEventListener("click", () => {
  const room = makeRoom();
  joinRoom(room);
});
roomInput.addEventListener("input", () => { roomInput.value = roomInput.value.replace(/\D/g, "").slice(0,6); });
editor.addEventListener("input", () => {
  charCount.textContent = `${editor.value.length.toLocaleString("id-ID")} / 20.000`;
  if (!currentRoom || applyingRemote) return;
  syncStatus.textContent = "Mengirim...";
  syncStatus.className = "text-amber-600";
  clearTimeout(debounceTimer);
  const value = editor.value;
  debounceTimer = setTimeout(async () => {
    try {
      await dbSet(dbRef(db, `rooms/${currentRoom}`), { text: value, updatedAt: dbServerTimestamp() });
      lastLocalText = value;
      syncStatus.textContent = "● Tersinkron langsung";
      syncStatus.className = "text-green-600";
    } catch (err) {
      syncStatus.textContent = `Gagal mengirim: ${err.message}`;
      syncStatus.className = "text-red-600";
    }
  }, 60);
});
document.getElementById("clearBtn").addEventListener("click", async () => {
  if (!currentRoom || !confirm("Hapus semua teks pada room ini?")) return;
  editor.value = "";
  charCount.textContent = "0 / 20.000";
  try { await dbSet(dbRef(db, `rooms/${currentRoom}`), { text: "", updatedAt: dbServerTimestamp() }); }
  catch (e) { alert(`Tidak bisa menghapus: ${e.message}`); }
});
document.getElementById("leaveBtn").addEventListener("click", () => {
  if (unsubscribe) unsubscribe();
  clearTimeout(debounceTimer);
  currentRoom = null;
  editor.disabled = true;
  editorArea.classList.add("hidden");
  showStatus(connection, "Koneksi diputus.");
});
document.getElementById("copyBtn").addEventListener("click", async () => {
  if (!currentRoom) return;
  const url = new URL("display.html", location.href);
  url.searchParams.set("room", currentRoom);
  try {
    await navigator.clipboard.writeText(url.href);
    alert("Link tampilan berhasil disalin.");
  } catch {
    prompt("Salin link ini:", url.href);
  }
});
const params = new URLSearchParams(location.search);
if (params.has("room")) joinRoom(params.get("room"));
