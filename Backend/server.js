import express from "express"
// import init from "./initial.js"
import {router as gamingtimeRouter} from "./routes/gamingtime/index.js"
import {router as tasksRouter} from "./routes/tasks/index.js"
import {router as userRouter} from "./routes/user/index.js"
import {router as adminRouter} from "./routes/admin/index.js"

const app = express()
const port = 3000


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})


app.use("/api/time", gamingtimeRouter)
app.use("/api/task", tasksRouter)
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)


// app.use("/api", saveRouter)
app.use("", (req, res) => res.status(404).json({error: "not found"}))


export default app