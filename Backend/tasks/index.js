import express from "express"
const router = express.Router()

router.use("/all", (req, res) => {
    // TODO Return all tasks
    res.send(req.params.task)
})
router.use("/:task/start", (req, res) => { // TODO NAKE POST
  console.log(JSON.stringify(req.params.task))
    console.log(JSON.stringify(req.params))

  res.send(req.params.task)
})


router.get("/:task", (req, res) => {
  console.log(JSON.stringify(req.params.task))
      console.log(JSON.stringify(req.params))

  res.send(req.params.task)
})
router.post("/:task", (req, res) => {
  console.log(JSON.stringify(req.params.task))
      console.log(JSON.stringify(req.params))

  res.send(req.params.task)
})

export { router }