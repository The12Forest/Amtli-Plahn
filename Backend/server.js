import express from "express"
import {router as gamingtimeRouter} from "./gamingtime/index.js"
import { router as tasksRouter } from "./tasks/index.js"

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


app.use("/api/time", gamingtimeRouter)
app.use("/api/:user/task", tasksRouter)

app.use("", (req, res) => res.status(404).json({error: "not found"}))



export default app