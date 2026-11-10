import { db, dbRef, dbOnValue, ready } from "./firebase.js";
import { setupTheme, validRoom } from "./common.js";
setupTheme();

const roomInput = document.getElementById("roomInput");
const connectBtn = document.getElementById("connectBtn");
const status = document.getElementById("status");
const roomLabel = document.getElementById("roomLabel");
const displayText = document.getElementById("displayText");
let unsubscribe = null;

async function connect(room) {
  if (!validRoom(room)) { status.textContent = "Masukkan Room ID yang terdiri dari 6 angka."; return; }
  try {
    await ready;
    if (unsubscribe) unsubscribe();
    roomInput.value = room;
    roomLabel.textContent = `ROOM ${room}`;
    status.textContent = "Menghubungkan...";
    unsubscribe = dbOnValue(dbRef(db, `rooms/${room}/text`), snapshot => {
      const value = snapshot.val();
      displayText.textContent = value === null || value === "" ? "Menunggu tulisan..." : value;
      status.textContent = "● LIVE — menerima pembaruan";
      status.className = "text-xs text-green-600";
    }, error => {
      status.textContent = `Koneksi gagal: ${error.message}`;
      status.className = "text-xs text-red-600";
    });
  } catch (err) {
    status.textContent = `Gagal masuk: ${err.message}`;
  }
}
connectBtn.addEventListener("click", () => connect(roomInput.value.trim()));
roomInput.addEventListener("input", () => { roomInput.value = roomInput.value.replace(/\D/g, "").slice(0,6); });
document.getElementById("fullBtn").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (e) { alert(`Fullscreen tidak tersedia: ${e.message}`); }
});
const params = new URLSearchParams(location.search);
if (params.has("room")) connect(params.get("room"));
