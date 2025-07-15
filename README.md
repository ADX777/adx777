<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔐 TimeLock Ghi Chú</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>🔐 TimeLock Ghi Chú</h1>
    <h2>1. Nhập ghi chú & mã hóa</h2>
    <label>📝 Ghi chú bí mật:</label>
    <textarea id="noteInput" placeholder="Nhập ghi chú..."></textarea>

    <label>💲 Cặp coin (ví dụ: BTCUSDT):</label>
    <input id="coinInput" placeholder="Bắt đầu nhập...">

    <p>💵 Giá hiện tại: <span id="priceDisplay">Đang tải...</span></p>

    <label>💰 Mức giá mong muốn:</label>
    <input id="targetPrice" placeholder="VD: 62000">

    <label>⏰ Thời gian khóa:</label>
    <input type="datetime-local" id="unlockTime">

    <button onclick="encryptNote()">🔐 Mã hóa</button>
    <textarea id="encryptedNote" placeholder="Mã đã mã hóa..." readonly></textarea>

    <h2>2. Giải mã ghi chú</h2>
    <textarea id="noteToDecrypt" placeholder="Nhập mã đã mã hóa..."></textarea>
    <button onclick="decryptNote()">🔓 Giải mã</button>
    <textarea id="decryptedNote" placeholder="Ghi chú đã giải mã..." readonly></textarea>
  </div>
  <script src="script.js"></script>
</body>
</html>
body {
  background-color: #000;
  color: #FFD700;
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: auto;
}

input, textarea {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

button {
  background-color: #FFD700;
  color: #000;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}
async function fetchPrice(coin) {
  const binanceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${coin.toUpperCase()}`;
  try {
    const res = await fetch(binanceUrl);
    const data = await res.json();
    return parseFloat(data.price);
  } catch {
    return null;
  }
}

document.getElementById("coinInput").addEventListener("input", async (e) => {
  const coin = e.target.value;
  const price = await fetchPrice(coin);
  document.getElementById("priceDisplay").textContent = price ? price : "Không lấy được";
});

function encryptNote() {
  const note = document.getElementById("noteInput").value;
  const coin = document.getElementById("coinInput").value;
  const target = document.getElementById("targetPrice").value;
  const time = document.getElementById("unlockTime").value;
  const payload = { note, coin, target, time };
  const encoded = btoa(JSON.stringify(payload));
  document.getElementById("encryptedNote").value = encoded;
}

async function decryptNote() {
  const encoded = document.getElementById("noteToDecrypt").value;
  try {
    const decoded = JSON.parse(atob(encoded));
    const now = new Date();
    const unlockTime = new Date(decoded.time);
    const price = await fetchPrice(decoded.coin);
    const canUnlock = (price >= parseFloat(decoded.target)) || (now >= unlockTime);
    document.getElementById("decryptedNote").value = canUnlock ? decoded.note : "🔒 Chưa đủ điều kiện giải mã!";
  } catch {
    document.getElementById("decryptedNote").value = "❌ Mã không hợp lệ!";
  }
}
body {
  background-color: #000;
  color: #FFD700;
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  padding: 20px;
}
input, textarea {
  background-color: #111;
  color: #FFD700;
  border: 1px solid #FFD700;
  border-radius: 6px;
  padding: 8px;
  margin: 5px;
  width: 90%;
}
button {
  background-color: #FFD700;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
