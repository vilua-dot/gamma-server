import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Простое логирование всех запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Жёстко заданные аккаунты
const users = new Map([
  ["xKaratel", { passHash: bcrypt.hashSync("david2011", 8), hwid: null }],
  ["6lua",     { passHash: bcrypt.hashSync("JastreerYT", 8), hwid: null }],
  ["Atopa", { passHash: bcrypt.hashSync("atopa2011", 8), hwid: null }],
]);

app.post("/auth", (req, res) => {
  const { login, password, hwid } = req.body || {};
  console.log(`AUTH attempt login=${login || "?"} hwid=${hwid || "?"}`);

  if (!login || !password || !hwid) {
    console.log(`AUTH fail: missing fields for ${login}`);
    return res.json({ ok: false, message: "missing fields" });
  }

  const acc = users.get(login);
  if (!acc || !bcrypt.compareSync(password, acc.passHash)) {
    console.log(`AUTH fail: bad creds for ${login}`);
    return res.json({ ok: false, message: "bad creds" });
  }

  if (acc.hwid && acc.hwid !== hwid) {
    console.log(`AUTH fail: hwid mismatch for ${login}`);
    return res.json({ ok: false, message: "hwid mismatch" });
  }

  if (!acc.hwid) {
    acc.hwid = hwid; // привязываем первый HWID
    console.log(`AUTH bind hwid for ${login}`);
  }

  console.log(`AUTH success for ${login}`);
  return res.json({ ok: true, token: uuid(), message: "ok" });
});

app.listen(PORT, () => console.log("auth server on", PORT));

