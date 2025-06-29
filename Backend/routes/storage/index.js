import express from "express"
import { Time } from "../../time/time.js";
const router = express.Router()
const logprefix = "AdminRouter:     "
const baseurl = "http://127.0.0.1"

router.use("/save", (req, res) => {
    console.log(Time() + logprefix + "All data saved.")
    fetch(baseurl + "/api/task/save")
    fetch(baseurl + "/api/user/save")
    fetch(baseurl + "/api/time/save")
    fetch(baseurl + "/api/login/save")
    res.send("All data saved.")
})

router.use("/load", (req, res) => {
    console.log(Time() + logprefix + "All data loaded.")
    fetch(baseurl + "/api/task/load")
    fetch(baseurl + "/api/user/load")
    fetch(baseurl + "/api/time/load")
    fetch(baseurl + "/api/login/load")
    res.send("All data loaded.")
})

router.use("/space", (req, res) => {
    console.log(Time() + logprefix)
    res.send("Space in log created.")
})

router.use("/log/:logmessage", (req, res) => {
    console.log(Time() + logprefix + req.params.logmessage)
    res.send("Added message to log.")
})

router.use("", (req, res) => res.status(404).json({error: "not found"}))

export {router}
