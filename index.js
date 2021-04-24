const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express(); //inzializzo server
app.use(formidable()); //attivo formidable
app.use(cors()); //attivo cors

const api_key = process.env.MAILGUN_API_KEY; /* VOTRE CLÉ API */
const domain = process.env.MAILGUN_DOMAIN; /*domain sand man*/
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.post("/form", (req, res) => {
  const { firstname, lastname, email, subject, message } = req.fields;
  console.log(req.fields);
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "mirkochiavaroli@gmail.com" /* EMAIL MAILGUN */,
    subject: subject,
    text: message,
  };
  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.json(body);
    }
    res.status(401).json(error);
  });
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

app.listen(3000, () => {
  console.log("Server has Started");
});
