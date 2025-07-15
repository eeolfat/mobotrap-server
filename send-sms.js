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

// تابع ارسال پیامک به صورت Promise
function sendSMS(receptor, message) {
  return new Promise((resolve, reject) => {
    console.log("📨 [درخواست پیامک] گیرنده:", receptor, "| متن:", message);

    api.Send(
      {
        message: message,
        sender: "2000660110",
        receptor,
      },
      (response, status) => {
        if (status === 200) {
          console.log("✅ [ارسال موفق] پاسخ:", response);
          resolve(response);
        } else {
          console.error("❌ [ارسال ناموفق] وضعیت:", status, "| پاسخ:", response);
          reject(response);
        }
      }
    );
  });
}

// هندل کردن POST به /api/send-sms
app.post("/api/send-sms", async (req, res) => {
  const { receptor, message } = req.body;

  console.log("🔔 [API Hit] /api/send-sms | Body:", req.body);

  if (!receptor || !message) {
    console.warn("⚠️ [درخواست ناقص] receptor یا message نیامده");
    return res.status(400).json({ error: "شماره یا پیامک ارسال نشده است." });
  }

  try {
    const result = await sendSMS(receptor, message);
    res.json({ success: true, result });
  } catch (error) {
    console.error("❌ [خطا هنگام ارسال پیامک]:", error);
    res.status(500).json({ error: "خطا در ارسال پیامک", details: error });
  }
});

// شروع سرور روی Railway
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SMS API running on http://0.0.0.0:${PORT}`);
});
