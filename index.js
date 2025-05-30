import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const baseurl = "http://127.0.0.1"




//Router Laden
import {router as gamingtimeRouter} from "./Backend/routes/time/index.js"
import {router as tasksRouter} from "./Backend/routes/tasks/index.js"
import {router as userRouter} from "./Backend/routes/user/index.js"
import {router as adminRouter} from "./Backend/routes/storage/index.js"
import {router as tempRouter} from "./Backend/routes/temp/index.js"
import {router as loginRouter} from "./Backend/routes/login/index.js"

//Setting Variables
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Ports Definieren
const httpPort = 80;
const httpsPort = 2007;

// SSL-Zertifikate laden
const certPath = path.join(__dirname, 'Cert');
const privateKey = fs.readFileSync(path.join(certPath, 'key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(certPath, 'cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };





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

app.use("/api/time", gamingtimeRouter)
app.use("/api/task", tasksRouter)
app.use("/api/user", userRouter)
app.use("/api/storage", adminRouter)
app.use("/api/temp", tempRouter)
app.use("/api/login", loginRouter)

app.get('/Main', (req, res) => {res.redirect('/')});
app.use("", (req, res) => {res.redirect('/')})




//HTTP-Server
http.createServer(app).listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort}`);
});

// HTTPS-Server
https.createServer(credentials, app).listen(httpsPort, () => {
  console.log(`HTTPS server running on port ${httpsPort}`);
});


fetch(baseurl + "/api/storage/load")
export default app