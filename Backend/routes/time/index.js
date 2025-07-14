import express from "express"
import cron from 'node-cron';
import fs from 'fs';
const router = express.Router()
const logprefix = "TimeRouter:      "
let time = []
let isGaming = []
let users = []



router.use("/save", (req, res) => {
  let buffer = JSON.stringify(time)
  fs.writeFileSync("./Backend/saves/time.json", buffer)
  console.log(logprefix + "Settings saved:         " + buffer)
  res.json(buffer)
})

router.use("/load", (req, res) => {
  time = JSON.parse(fs.readFileSync("./Backend/saves/time.json"))
  console.log(logprefix + "Times loaded:         "+ JSON.stringify(time))
  users = JSON.parse(fs.readFileSync("./Backend/saves/user.json"))
  console.log(logprefix + "Users loaded:         "+ JSON.stringify(users))
  isGaming = [];
  users.forEach(() => isGaming.push(false));
  res.json(time)
})

router.use("/deluser/:user", (req, res) => {
  let userID = users.indexOf(req.params.user)
  if (userID == -1) {
    res.send("User " + req.params.user + " dose not exists.")
    console.log(logprefix + "Delete user: User " + req.params.user + " dose not exists.")
  } else {
    time.splice(userID, 1)
    users.splice(userID, 1)
    isGaming.splice(userID, 1)
    res.send("User was deleted.")
    console.log(logprefix + "User deleted: " + req.params.user)
  }
})

router.use("/set/:userName/:time", (req, res) => {
  let userID = users.indexOf(req.params.userName)
  if (userID == -1) {
    users.push(req.params.userName)
    time.push(req.params.time)
    userID = users.indexOf(req.params.userName)
    console.log(logprefix + "User " + req.params.userName + " created.")
  }
  time[userID] = req.params.time
  res.status(200).json({"ok": true, "username": req.params.userName, "time": time[userID]})
  console.log(logprefix + "Time update: User "+ req.params.userName + " to " + time[userID])
})

router.use("/isgaming/:userName/:set", (req, res) => {
  let userID = users.indexOf(req.params.userName)
  let set
  if (req.params.set == "true") {
    if (time[userID] > 0) {
      set = true
    } else {
      set = false
    }
  } else if (req.params.set == "false") {
    set = false
  } else {
    return
  }
  isGaming[userID] = set;
  res.json({"Okay":true,"IsGaming":Boolean(req.params.set)})
  console.log(logprefix + 'Changing "IsGaming" for user: ' + req.params.userName + ' and set to: ' + Boolean(req.params.set))
})

router.use("/isgaming/:userName", (req, res) => {
  let userID = users.indexOf(req.params.userName)
  let isGmaingres = Boolean(isGaming[userID])
  res.json({"Okay":true,"IsGaming":isGmaingres})
  console.log(logprefix + 'Searched "IsGaming" for user: ' + req.params.userName + ' and responded with: ' + isGmaingres)
})

router.use("/:userName/:time", (req, res) => {
  let userID = users.indexOf(req.params.userName)
  if (userID == -1) {
    users.push(req.params.userName)
    time.push("0")
    userID = users.indexOf(req.params.userName)
    console.log(logprefix + "User " + req.params.userName + " created.")
  }
  time[userID] = String(parseInt(time[userID]) + parseInt(req.params.time))
  res.status(200).json({"ok": true, "username": req.params.userName, "time": time[userID]})
  console.log(logprefix + "Time update: User "+ req.params.userName + " to " + time[userID])
})

router.use("/:userName", (req, res) => {
  let userID = users.indexOf(req.params.userName)
  if (userID !== -1) {
    res.status(200).json({"ok": true, "username": req.params.userName, "time": time[userID]})
    console.log(logprefix + "Searched for UserTime User: " + req.params.userName + " Time: " + time[userID])
  } else {
    res.status(404).json({"ok": false, "username": req.params.userName, "time": "UserNotFound"})
    console.log(logprefix + "Searched for UserTime User: " + req.params.userName + " but he doesn't exist")
  }
})


cron.schedule('*/1 * * * *', () => {
  isGaming.forEach((value, index) => {
    if (value === true) {
      let timeInt = parseInt(time[index])
      if (timeInt > 0) {
        time[index] = String(timeInt - 1)
      } else {
        isGaming[index] = false
        fetch("https://home.lmvz.org/api/webhook/manuelPCShutdown", {
          method: "POST"
        })
      }
    }
  });
});


router.use("", (req, res) => res.status(404).json({error: "not found"}))

export {router}
