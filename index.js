// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { sendSMS } = require("./send-sms");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/send-sms", async (req, res) => {
  const { receptor, message } = req.body;

  try {
    const result = await sendSMS(receptor, message);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SMS API running on http://localhost:${PORT}`);
});
