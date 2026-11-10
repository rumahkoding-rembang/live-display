export function setupTheme() {
  const btn = document.getElementById("themeBtn");
  const saved = localStorage.getItem("ltd-theme");
  if (saved === "dark" || (!saved && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
  btn?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("ltd-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  });
}
export function validRoom(value) { return /^[0-9]{6}$/.test(value); }
export function showStatus(el, message, good=false) {
  el.textContent = message;
  el.className = `mt-4 text-sm ${good ? "text-green-600" : "text-amber-600"}`;
}
