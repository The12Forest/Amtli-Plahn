import express from "express"
import cors from "cors"
import gamingtime from "./route/gamingtime.js"

const app = express()

app.use(cors())
app.use(express.json())



app.use("/api/time", gamingtime)

app.use("*", (req, res) => res.status(404).json({error: "not found"}))




export default app