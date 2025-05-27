import express from "express"
// import bodyParser from "body-parser";
import cron from 'node-cron';
import fs from 'fs';
const router = express.Router()
const baseurl = "http://127.0.0.1:2007"
const logprefix = "TaskRouter:      "
let tasks = []
let users = []


router.use("/save", (req, res) => {
  let buffer = JSON.stringify(tasks)
  fs.writeFileSync("./Backend/saves/tasks.json", buffer)
  console.log(logprefix + "Settings saved: " + buffer)
  res.json(buffer)
})

router.use("/load", (req, res) => {
  tasks = JSON.parse(fs.readFileSync("./Backend/saves/tasks.json"))
  users = JSON.parse(fs.readFileSync("./Backend/saves/user.json"))
  console.log(logprefix + "Tasks loaded:  " + tasks)
  console.log(logprefix + "Users loaded:  " + users)
  res.json(tasks)
})

router.use("/adduser/:user", (req, res) => {
  if (users.indexOf(req.params.user) !== -1) {
    res.send("User already exists.")
    console.log(logprefix + "Tried to register user:  already exists.")   
  } else {  
    users.push(req.params.user)
    tasks.push([])
    console.log(logprefix + "Added user: " + req.params.user)
    res.json({"user added": req.params.user})  }  
})

router.get("/create/:user/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  if (userid !== -1) {
    tasks[userid].push(req.params.task)
    console.log(logprefix + "Creating task: " + req.params.task + " for user: " + req.params.user)
    res.send(tasks)
  } else {
    console.log(logprefix + "Creating task: But the user: " + req.params.user + " dose not exist.")
    res.send("User dose not exist.")
  }
})

router.get("/del/:user/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  let taskid = tasks[userid].indexOf(req.params.task)
  if (userid !== -1) {
    if (taskid !== -1) {
      tasks[userid].splice(taskid, 1)
      res.send(tasks)
      console.log(logprefix + "Deleting task: " + req.params.task + " of user: " + req.params.user + ".")
    } else {
      res.send("Task dose not exist.")
      console.log(logprefix + "Deleting task: Task: " + req.params.task + "of user " + req.params.user + " dose not exist.")
    }
  } else {
    res.send("User dose not exist.")
    console.log(logprefix + "Deleting task: User " + req.params.user + " dose not exist.")
  }
})

router.get("/done/:user/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  let taskid = req.params.task
  if (userid !== -1) {
    if (taskid !== -1) {
      tasks[userid].splice(taskid, 1)
      console.log(logprefix + "Task " + req.params.task + "of userid " + req.params.user + " marked as done.")
      fetch(baseurl + "/api/time/" + req.params.user + "/10")
      res.send(tasks)
    } else {
      res.send("Task dose not exist.")
      console.log(logprefix + "Task " + req.params.task + "of userid " + req.params.user + " tyred to mark as done, but it didn't exist.")
    }
  } else {
      console.log(logprefix + "Task " + req.params.task + " tyred to mark as done, but the user: '" + req.params.user + "' didn't exist.")
  }
})

router.get("/all/:user/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  if (userid !== -1) {
    res.json(tasks[userid])
    console.log(logprefix + "Searched for tasks of user: " + req.params.user + " and the tasks where " + tasks[userid])
  } else {
    console.log(logprefix + "Searched for tasks of user: " + req.params.user + " but the user didn't exist.")
    res.send("User doesn’t exist.")
  }
})



cron.schedule('0 0 * * *', () => {
  console.log("Es ist 00:00 Uhr!");
  console.log("Reset tasks")
  tasks = JSON.parse(fs.readFileSync("./saves/tasks.json"))
  console.log(logprefix + "Tasks loaded:  " + tasks)
});




export { router }
// task[user.indexOf(req.params.user)][task.indexOf[user.indexOf(req.params.user)](0)]