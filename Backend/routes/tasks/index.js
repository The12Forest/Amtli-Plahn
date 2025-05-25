import express from "express"
// import bodyParser from "body-parser";
import cron from 'node-cron';
import fs from 'fs';
const router = express.Router()
const logprefix = "TaskRouter:      "
let tasks = []
let users = []


router.use("/save", (req, res) => {
  let buffer = JSON.stringify(tasks)
  fs.writeFileSync("./saves/tasks.json", buffer)
  console.log(logprefix + "Settings saved: " + buffer)
  res.json(buffer)
})

router.use("/load", (req, res) => {
  tasks = JSON.parse(fs.readFileSync("./saves/tasks.json"))
  users = JSON.parse(fs.readFileSync("./saves/user.json"))
  console.log(logprefix + "Tasks loaded:  " + tasks)
  console.log(logprefix + "Users loaded:  " + users)
  res.json(tasks)
})

router.use("/update", (req, res) => {
  tasks = tasks
  res.json(tasks)
})

router.use("/adduser/:user", (req, res) => {
  if (users.indexOf(req.params.user) !== -1) {
    res.send("User already exists.")
    console.log(logprefix + "User already exists.")
  } else {  
    users.push(req.params.user)
    tasks.push([])
    res.json({"user added": req.params.user})
    console.log(logprefix + "user added: " + req.params.user)
  }  
})

// router.use("/start/:task", (req, res) => {
//   console.log(JSON.stringify(req.params.task))
//   console.log(JSON.stringify(req.params))

//   res.send(req.params.task)
// })

// router.use("/stop/:task", (req, res) => {
//   console.log(JSON.stringify(req.params.task))
//   console.log(JSON.stringify(req.params))

//   res.send(req.params.task)
// })


router.get("/create/:user/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  if (userid !== -1) {
    tasks[userid].push(req.params.task)
    res.send(tasks)
  } else {
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
    } else {
      res.send("Task dose not exist.")
    }
  } else {
    res.send("User dose not exist.")
  }
})

router.get("/done/:user/:task/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  let taskid = req.params.task
  if (userid !== -1) {
    if (taskid !== -1) {
      tasks[userid].splice(taskid, 1)
      console.log(logprefix + "Task " + taskid + " marked as done.")
      fetch("http://localhost:3000/api/time/" + req.params.user + "/10")
      res.send(tasks)
    } else {
      res.send("Task dose not exist.")
      console.log(logprefix + "Task " + taskid + " tryed to marke as done, but it dosen't exist.")
    }
  } else {
      console.log(logprefix + "Task " + taskid + " tryed to marke as done, but the user: '" + req.params.user + "' dosen't exist.")
  }
})

router.get("/all/:user/", (req, res) => {
  let userid = users.indexOf(req.params.user)
  if (userid !== -1) {
    res.json(tasks[userid])
  } else {
    res.send("User dose not exist.")
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