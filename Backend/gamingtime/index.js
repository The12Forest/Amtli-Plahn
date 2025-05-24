import express from "express"
const router = express.Router()
let time = 0

router.use("/:userName", (req, res) => {
  console.log(JSON.stringify(req.params))
  console.log(JSON.stringify(req.body))
  console.log(JSON.stringify(req.params.userName))


  res.send(time)
  time++
})
/*router.use("/silvan", (req, res) => {
  res.send(time)
  time++
})
router.use("/david", (req, res) => {
  res.send({"time": time, "user": "david"})
  time++
})*/



router.use("", (req, res) => res.status(404).json({error: "not found"}))
export {router}