import express from "express"
const router = express.Router()
import fs from 'fs';
let user = []
const logprefix =  "UserRouter:      "
const baseurl = "https://127.0.0.1:2007"



router.use("/save", (req, res) => {
  let buffer = JSON.stringify(user)
  fs.writeFileSync("./Backend/saves/user.json", buffer)
  res.json(buffer)
  console.log(logprefix + "Settings saved: " + buffer)
})

router.use("/load", (req, res) => {
  user = JSON.parse(fs.readFileSync("./Backend/saves/user.json"))
  res.json(user)
  console.log(logprefix + "Users loaded:  " + user)
})

router.use("/add/:user", (req, res) => {
  if (user.indexOf(req.params.user) !== -1) {
    res.send("User " + req.params.user + " already exists.")
    console.log(logprefix + "User " + req.params.user + " already exists.")
  } else {
    user.push(req.params.user)
    fetch(baseurl + "/api/time/" + req.params.user + "/0")
    fetch(baseurl + "/api/task/adduser/" + req.params.user)
    res.send(user)
    console.log(logprefix + "User added: " + req.params.user)
  }
})

router.use("/all", (req, res) => {
  res.json(user)
  console.log(logprefix + "Searched for users: " + user)
})



router.use("", (req, res) => res.status(404).json({error: "not found"}))
export {router}


fetch(baseurl + "/api/storage/load")
