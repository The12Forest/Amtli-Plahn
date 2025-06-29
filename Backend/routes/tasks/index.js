import express from "express"
import cron from 'node-cron';
import fs from 'fs';
const router = express.Router()
const baseurl = "http://127.0.0.1"
const logprefix = "TaskRouter:      "
let tasks = []
let users = []
let task_times = []


router.use("/save", (req, res) => {
  let buffer = JSON.stringify(tasks)
  fs.writeFileSync("./Backend/saves/tasks.json", buffer)
  console.log(logprefix + "Settings tasks saved:      " + buffer)
  buffer = JSON.stringify(task_times)
  fs.writeFileSync("./Backend/saves/task_times.json", buffer)
  console.log(logprefix + "Settings times saved:      " + buffer)
  res.json(buffer)
})

router.use("/load", (req, res) => {
  task_times = JSON.parse(fs.readFileSync("./Backend/saves/task_times.json"))
  tasks = JSON.parse(fs.readFileSync("./Backend/saves/tasks.json"))
  users = JSON.parse(fs.readFileSync("./Backend/saves/user.json"))
  console.log(logprefix + "Times loaded:         " + JSON.stringify(task_times))
  console.log(logprefix + "Tasks loaded:         " + JSON.stringify(tasks))
  console.log(logprefix + "Users loaded:         " + JSON.stringify(users))
  res.json(tasks)
})

router.use("/adduser/:user", (req, res) => {
  if (users.indexOf(req.params.user) !== -1) {
    res.send("User already exists.")
    console.log(logprefix + "Tried to register user:  already exists.")   
  } else {  
    users.push(req.params.user)
    for (let day = 0; day < 7; day++) {
      tasks[day].push([])
    }

    console.log(logprefix + "Added user: " + req.params.user)
    res.json({"user added": req.params.user})  }  
})

router.use("/deluser/:user", (req, res) => {
  let userID = users.indexOf(req.params.user)
  if (users.indexOf(req.params.user) == -1) {
    res.send("User " + req.params.user + " dose not exists.")
    console.log(logprefix + "Delete user: User " + req.params.user + " dose not exists.")
  } else {
    for (let day = 0; day < 7; day++) {
      tasks[day].splice(userID, 1)
    }
    users.splice(userID, 1)
    res.send("User was deleted.")
    console.log(logprefix + "User deleted: " + req.params.user)
  }
})

router.get("/create/:user/:day/:time/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  if (userid !== -1) {
    tasks[req.params.day][userid].push(req.params.task)
    task_times[req.params.day][userid].push(req.params.time)    
    console.log(logprefix + "Creating task: " + req.params.task + " for user: " + req.params.user + " with time: " + req.params.time)
    res.send(tasks)
  } else {
    console.log(logprefix + "Creating task: But the user: " + req.params.user + " dose not exist.")
    res.send("User dose not exist.")
  }
}) 
router.get("/del/:user/:day/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  let taskid = tasks[req.params.day][userid].indexOf(req.params.task)
  if (userid !== -1) {
    if (taskid !== -1) {
      tasks[req.params.day][userid].splice(taskid, 1)
      task_times[req.params.day][userid].splice(taskid, 1)
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

router.get("/done/:user/:day/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  let taskid = req.params.task
  if (userid !== -1) {
    if (taskid !== -1) {
      tasks[req.params.day][userid].splice(taskid, 1)
      task_times[req.params.day][userid].splice(taskid, 1)
      console.log(logprefix + "Task " + req.params.task + " of userid " + req.params.user + " marked as done.")
      fetch(baseurl + "/api/time/" + req.params.user + "/" + task_times[req.params.day][userid])
      res.send(tasks)
    } else {
      res.send("Task dose not exist.")
      console.log(logprefix + "Task " + req.params.task + "of userid " + req.params.user + " tyred to mark as done, but it didn't exist.")
    }
  } else {
      console.log(logprefix + "Task " + req.params.task + " tyred to mark as done, but the user: '" + req.params.user + "' didn't exist.")
  }
})

router.get("/all/:user/:day/", (req, res) => {
  let day = parseInt(req.params.day);
  let userid = users.indexOf(req.params.user)
  if (userid !== -1) {
    res.json(tasks[day][userid])
    console.log(logprefix + "Searched for tasks of user: " + req.params.user + " and the tasks where " + tasks[userid])
  } else {
    console.log(logprefix + "Searched for tasks of user: " + req.params.user + " but the user didn't exist.")
    res.send("User doesn’t exist.")
  }
})

router.get("/timesall/:user/:day/", (req, res) => {
  let day = parseInt(req.params.day);
  let userid = users.indexOf(req.params.user)
  if (userid !== -1) {
    res.json(task_times[day][userid])
    console.log(logprefix + "Searched for task-times of user: " + req.params.user + " and the task-times where " + task_times[day][userid])
  } else {
    console.log(logprefix + "Searched for task-times of user: " + req.params.user + " but the user didn't exist.")
    res.send("User doesn’t exist.")
  }
})



cron.schedule('0 0 * * 0', () => {
  console.log("Es ist 00:00 Uhr! am Sonntag");
  console.log("Reset tasks")
  
  fetch(baseurl + "/api/task/load/")
});

router.use("", (req, res) => res.status(404).json({error: "not found"}))
export { router }