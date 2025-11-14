import express from "express"
const router = express.Router()
const logprefix = "StorageRouter:   "
const baseurl = "http://127.0.0.1"

router.use("/save", (req, res) => {
    fetch(baseurl + "/api/task/save")
    fetch(baseurl + "/api/user/save")
    fetch(baseurl + "/api/time/save")
    fetch(baseurl + "/api/login/save")
    res.json({"Okay": true, "reason": "All data saved."})
    console.log(logprefix + "All data saved.")
})

router.use("/load", (req, res) => {
    fetch(baseurl + "/api/task/load")
    fetch(baseurl + "/api/user/load")
    fetch(baseurl + "/api/time/load")
    fetch(baseurl + "/api/login/load")
    res.json({"Okay": true, "reason": "All data loaded."})
    console.log(logprefix + "All data loaded.")
})

router.use("/space", (req, res) => {
    console.log(logprefix)
    res.json({"Okay": true, "reason": "Space in log created."})
})

router.use("/log/:logmessage", (req, res) => {
    console.log(logprefix + req.params.logmessage)
    res.json({"Okay": true, "reason": "Added message to log."})
})

router.use("", (req, res) => res.status(404).json({"ok": false, "error": "not found"}))

export {router}
