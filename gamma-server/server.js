import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const users = new Map([
  ["xKaratel", { passHash: bcrypt.hashSync("david2011", 8), hwid: null }],
  ["6lua",     { passHash: bcrypt.hashSync("JastreerYT", 8), hwid: null }],
]);

app.post("/auth", (req, res) => {
  const { login, password, hwid } = req.body || {};
  if (!login || !password || !hwid) return res.json({ ok: false, message: "missing fields" });
  const acc = users.get(login);
  if (!acc || !bcrypt.compareSync(password, acc.passHash)) return res.json({ ok: false, message: "bad creds" });
  if (acc.hwid && acc.hwid !== hwid) return res.json({ ok: false, message: "hwid mismatch" });
  if (!acc.hwid) acc.hwid = hwid; // закрепляем первый HWID
  return res.json({ ok: true, token: uuid(), message: "ok" });
});

app.listen(PORT, () => console.log("auth server on", PORT));
