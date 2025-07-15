async function encryptNote() {
  const note = document.getElementById("noteInput").value;
  const coin = document.getElementById("coinInput").value;
  const targetPrice = document.getElementById("targetPriceInput").value;
  const unlockTime = document.getElementById("unlockTimeInput").value;
  const payload = JSON.stringify({note, coin, targetPrice, unlockTime});
  const enc = new TextEncoder();
  const key = await crypto.subtle.generateKey({name: "AES-CBC", length: 256}, true, ["encrypt", "decrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const cipher = await crypto.subtle.encrypt({name: "AES-CBC", iv}, key, enc.encode(payload));
  const data = btoa(String.fromCharCode(...new Uint8Array(cipher)));
  document.getElementById("encryptedOutput").value = data;
}

async function decryptNote() {
  const encrypted = document.getElementById("decryptInput").value;
  try {
    const bin = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    // Mô phỏng thất bại vì thiếu key & iv -> Demo logic
    document.getElementById("decryptedNote").value = "🔒 Không đủ điều kiện để giải mã.";
  } catch {
    document.getElementById("decryptedNote").value = "❌ Mã không hợp lệ hoặc đã bị chỉnh sửa.";
  }
}
