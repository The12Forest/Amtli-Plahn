import express from "express"

const router = express.Router()
const logprefix = "ShutdownRouter:  "

router.use("", (req, res) => {
    res.json({"Okay":true,"Shutdown":true,"ShutdownNow":true})
    console.log(logprefix + "Shutdown was triggered")
    setTimeout(() => {
        process.exit(0);
    }, 500);
})


export { router }