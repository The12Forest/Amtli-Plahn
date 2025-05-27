import express from "express"
const router = express.Router()
const logprefix = "AdminRouter:     "
const baseurl = "http://127.0.0.1:2007"

router.use("/save", (req, res) => {
    console.log(logprefix + "All data saved.")
    fetch(baseurl + "/api/task/save")
    fetch(baseurl + "/api/user/save")
    fetch(baseurl + "/api/time/save")
    res.send("All data saved.")
})

router.use("/load", (req, res) => {
    console.log(logprefix + "All data loaded.")
    fetch(baseurl + "/api/task/load")
    fetch(baseurl + "/api/user/load")
    fetch(baseurl + "/api/time/load")
    res.send("All data loaded.")
})

router.use("/space", (req, res) => {
    console.log(logprefix)
    res.send("Space in log created.")
})

router.use("", (req, res) => res.status(404).json({error: "not found"}))
export {router}
