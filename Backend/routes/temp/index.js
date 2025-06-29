import express from "express"
import { Time } from "../../time/time.js";
const router = express.Router()
const logprefix = "TempRouter:      "
let temp


router.use("/set/:user", (req, res) => {
  temp = req.params.user
  console.log(Time() + logprefix + "Set temp to:", temp);
  res.json({"ok": true, "set": req.params.user})
})

router.use("/get", (req, res) => {
  console.log(Time() + logprefix + "Responded: " + temp)
  res.json({"ok": true, "set": temp})
})

router.use("", (req, res) => res.status(404).json({error: "not found"}))

export { router }
