// server/send-sms.js
const express = require("express");
const Kavenegar = require("kavenegar");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const api = Kavenegar.KavenegarApi({
  apikey: process.env.KAVENEGAR_API_KEY,
});

app.post("/api/send-sms", (req, res) => {
  const { receptor, message } = req.body;

console.log("📨 درخواست پیامک دریافت شد:", receptor, message); // لاگ جدید
console.log("sending  Kavenegar => receptor:", receptor, "| message:", message);
  api.Send(
    {
      message,
      sender: "2000660110",
      receptor,
    },
    function (response, status) {
      console.log("📬 وضعیت ارسال:", status, response); // لاگ وضعیت

      if (status === 200) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "خطا در ارسال پیامک", response });
      }
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("SMS API running on http://localhost:" + PORT);
});
