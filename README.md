<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🔐 TimeLock Ghi Chú</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>🔐 TimeLock Ghi Chú</h1>
    <h2>1. Nhập ghi chú & mã hóa</h2>

    <label>📝 Ghi chú:</label>
    <textarea id="noteInput" placeholder="Nhập ghi chú..."></textarea>

    <label>💴 Cặp coin (ví dụ: BTCUSDT)</label>
    <input id="coinInput" list="coinList" placeholder="Bắt đầu nhập..." />
    <datalist id="coinList">
      <option value="BTCUSDT">
      <option value="ETHUSDT">
      <option value="BNBUSDT">
    </datalist>

    <div id="priceDisplay">💰 Giá hiện tại: Đang tải...</div>

    <label>💰 Mức giá mong muốn:</label>
    <input id="priceInput" placeholder="VD: 62000" />

    <label>⏰ Thời gian khóa:</label>
    <input type="datetime-local" id="timeInput" />

    <button onclick="encrypt()">🔐 Mã hóa</button>

    <h2>2. Giải mã</h2>
    <label>📦 Mã đã mã hóa</label>
    <textarea id="encryptedInput" placeholder='{"data":"..."}'></textarea>
    <button onclick="decrypt()">🔓 Giải mã</button>

    <h2>Kết quả giải mã:</h2>
    <div id="output"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>
body {
  background-color: #000;
  color: #ffd700;
  font-family: 'Courier New', monospace;
  padding: 20px;
}
.container {
  max-width: 600px;
  margin: auto;
}
input, textarea {
  width: 100%;
  padding: 10px;
  margin: 5px 0 15px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
}
button {
  background-color: #ffd700;
  color: black;
  font-weight: bold;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color: #ffcc00;
}
#output {
  background: #111;
  padding: 15px;
  border-radius: 5px;
  color: #00ff66;
  white-space: pre-wrap;
}
async function fetchPrice(symbol) {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    const data = await res.json();
    return parseFloat(data.price);
  } catch {
    return null;
  }
}

function aesEncrypt(text, key) {
  return btoa(unescape(encodeURIComponent(text))); // Simulate AES
}

function aesDecrypt(cipher) {
  return decodeURIComponent(escape(atob(cipher)));
}

async function encrypt() {
  const note = document.getElementById("noteInput").value;
  const coin = document.getElementById("coinInput").value.toUpperCase();
  const price = document.getElementById("priceInput").value;
  const time = document.getElementById("timeInput").value;

  if (!note || !coin || !price || !time) {
    alert("Điền đầy đủ thông tin trước khi mã hóa.");
    return;
  }

  const encrypted = aesEncrypt(note);
  const payload = {
    data: encrypted,
    coin,
    price,
    time
  };

  document.getElementById("encryptedInput").value = JSON.stringify(payload);
}

async function decrypt() {
  const input = document.getElementById("encryptedInput").value;
  if (!input) return;

  try {
    const obj = JSON.parse(input);
    const now = new Date();
    const unlockTime = new Date(obj.time);

    const price = await fetchPrice(obj.coin);
    document.getElementById("priceDisplay").innerText = `💰 Giá hiện tại: ${price}`;

    if (price >= obj.price || now >= unlockTime) {
      const decrypted = aesDecrypt(obj.data);
      document.getElementById("output").innerText =
        `📝 Ghi chú: ${decrypted}\n💸 Coin: ${obj.coin}\n💰 Giá kỳ vọng: ${obj.price}\n⏰ Mở khóa sau: ${obj.time}`;
    } else {
      document.getElementById("output").innerText = `🔒 Chưa đạt điều kiện mở khóa.\nGiá hiện tại: ${price}\nGiá yêu cầu: ${obj.price}\nThời gian mở: ${obj.time}`;
    }
  } catch (e) {
    document.getElementById("output").innerText = "❌ Dữ liệu mã hóa không hợp lệ.";
  }
}

document.getElementById("coinInput").addEventListener("input", async (e) => {
  const symbol = e.target.value.toUpperCase();
  if (symbol.length >= 6) {
    const price = await fetchPrice(symbol);
    document.getElementById("priceDisplay").innerText = price ? `💰 Giá hiện tại: ${price}` : "❌ Không lấy được giá.";
  }
});
