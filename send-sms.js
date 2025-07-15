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
    console.log("📨 درخواست پیامک دریافت شد:", receptor, message);
    console.log("sending Kavenegar => receptor:", receptor, "| message:", message);

    api.Send(
      {
        message,
        sender: "2000660110",
        receptor,
      },
      (response, status) => {
        console.log("📬 وضعیت ارسال:", status, response);
        if (status === 200) resolve(response);
        else reject(response);
      }
    );
  });
}

app.post("/api/send-sms", async (req, res) => {
  const { receptor, message } = req.body;

  try {
    const result = await sendSMS(receptor, message);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: "خطا در ارسال پیامک", details: error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("SMS API running on http://localhost:" + PORT);
});
