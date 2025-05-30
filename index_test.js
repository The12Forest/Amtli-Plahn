import {router as gamingtimeRouter} from "./Backend/routes/gamingtime/index.js"
import {router as tasksRouter} from "./Backend/routes/tasks/index.js"
import {router as userRouter} from "./Backend/routes/user/index.js"
import {router as adminRouter} from "./Backend/routes/storage/index.js"
import {router as tempRouter} from "./Backend/routes/temp/index.js"
import {router as loginRouter} from "./Backend/routes/login/index.js"
// import fs from 'fs';
// import https from "https";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 2007;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Server HTTPS
// const key = fs.readFileSync("./cert/server5.techsvc.de-key.pem");
// const cert = fs.readFileSync("./cert/server5.techsvc.de.pem");

// https.createServer({ key, cert }, app).listen(443, () => {
//   console.log("Server läuft unter https://localhost");
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});


//Serve HTML

app.get('/Main', (req, res) => {res.redirect('/')});
app.use('/', express.static(path.join(__dirname, 'Frontend', 'main')));
app.use('/user', express.static(path.join(__dirname, 'Frontend', 'user')));
app.use('/admin', express.static(path.join(__dirname, 'Frontend', 'admin-login')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'main', 'main.html'));
});
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'user', 'main.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'admin-login', 'main.html'));
});



//Server API

app.use("/api/time", gamingtimeRouter)
app.use("/api/task", tasksRouter)
app.use("/api/user", userRouter)
app.use("/api/storage", adminRouter)
app.use("/api/temp", tempRouter)
app.use("/api/login", loginRouter)


app.use("*", (req, res) => {res.redirect('/')})


export default app