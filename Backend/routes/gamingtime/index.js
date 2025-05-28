import express from "express"
import fs from 'fs';
const router = express.Router()
const logprefix = "GamingRouter:    "
let time = []


router.use("/save", (req, res) => {
  let buffer = JSON.stringify(time)
  fs.writeFileSync("./Backend/saves/time.json", buffer)
  console.log(logprefix + "Settings saved: " + buffer)
  res.json(buffer)
})

router.use("/load", (req, res) => {
  time = JSON.parse(fs.readFileSync("./Backend/saves/time.json"))
  console.log(logprefix + "Times loaded:  "+ time)
  res.json(time)
})


router.use("/:userName/:time", (req, res) => {
  let usertime = time.indexOf(req.params.userName)
  usertime = parseInt(usertime)
  if (usertime == -1) {
    time.push(req.params.userName)
    time.push("0")
    usertime = time.indexOf(req.params.userName)
    usertime = parseInt(usertime)
    console.log(logprefix + "User " + req.params.userName + " created.")
  }
  usertime = usertime + 1
  time[usertime] = String(parseInt(time[usertime]) + parseInt(req.params.time))
  res.status(200).json({"ok": true, "username": req.params.userName, "time": time[usertime]})
  console.log(logprefix + "Time update: User "+ req.params.userName + " to " + time[usertime])
})

router.use("/:userName", (req, res) => {
  let usertime = time.indexOf(req.params.userName)
  usertime = parseInt(usertime)
  if (usertime !== -1) {
    usertime = usertime + 1
    res.status(200).json({"ok": true, "username": req.params.userName, "time": time[usertime]})
    console.log(logprefix + "Searched for UserTime User: " + req.params.userName + " Time: " + time[usertime])
  } else {
    res.status(404).json({"ok": false, "username": req.params.userName, "time": "UserNotFound"})
    console.log(logprefix + "Searched for UserTime User: " + req.params.userName + " but he doesn't exist")
  }
})



router.use("", (req, res) => res.status(404).json({error: "not found"}))
export {router}
