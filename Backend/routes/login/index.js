import express from "express"
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router()
const logprefix = "LoginRouter:     "
const adminPanelDir = "../../../Frontend/admin";
const adminPanelPath = path.join(adminPanelDir, "main.html");
let passwords = []

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.use("/save", (req, res) => {
  let buffer = JSON.stringify(passwords)
  fs.writeFileSync("./Backend/saves/passwords.json", buffer)
    //   console.log(logprefix + "Passwords saved:     " + buffer)
  console.log(logprefix + "Passwords saved:     " + '"Hidden"')
  res.send("Passwords Saved")
})

router.use("/load", (req, res) => {
  passwords = JSON.parse(fs.readFileSync("./Backend/saves/passwords.json"))
  // console.log(logprefix + "Passwords loaded:  " + JSON.stringify(passwords))
  console.log(logprefix + "Passwords loaded:     " + '["Hidden"]')
  res.send("Passwords loaded")  
})

router.get("/create/:passwdold/:passwd", (req, res) => {
  let passwdIndex = passwords.indexOf(req.params.passwdold);
  
  if (passwdIndex !== -1) {
    let userid = passwords.indexOf(req.params.passwd)
    if (userid == -1) {
      passwords.push(req.params.passwd)
      console.log(logprefix + "Creating password for user: " + passwords.indexOf(req.params.passwdold))
      res.send("Password was added.")
    } else { 
      console.log(logprefix + "Creating password: But the password: " + req.params.passwd + " already exists.")
      res.send("Password dose already exist.")
    }
  } else {
    console.log(logprefix + "Admin user tried to create new Admin but the username/password was wrong.");
    res.status(401).send("Unauthorized"); // optional: mit Statuscode
  }
})

router.get("/delete/:passwd", (req, res) => {
  if (passwords.length > 1) {
    let userid = passwords.indexOf(req.params.passwd)
    if (userid !== -1) {
      console.log(logprefix + "Deleting password for user: " + passwords.indexOf(req.params.passwdold))
      passwords.splice(userid)
      res.json({"ok": true, "successful": true})
    } else { 
      console.log(logprefix + "Deleting password: But the password: " + req.params.passwd + " dose not exists.")
      res.json({"ok": false, "successful": false})  
    }
  }
})


router.get("/update/:passwdold/:passwd", (req, res) => {
  let userid = passwords.indexOf(req.params.passwdold)
  if (userid == -1) {
    console.log(logprefix + "Updating password: " + req.params.passwd + " but password dose not exist.")
    res.send("Password was not updated because it does not exist.")
  } else { 
    console.log(logprefix + "Updating password from user: " + passwords.indexOf(req.params.passwd))
    passwords[userid] = req.params.passwd
    res.send("Password updated successfully.")
  }
})



router.get("/:passwd", (req, res) => {
  let passwdIndex = passwords.indexOf(req.params.passwd);
  
  if (passwdIndex !== -1) {
    console.log(logprefix + "Admin user: " + passwdIndex + " logged in.");
    res.sendFile(path.resolve(__dirname, adminPanelPath));
  } else {
    console.log(logprefix + "Admin user tried to login but the username/password was wrong.");
    res.status(401).send("Unauthorized"); // optional: mit Statuscode
  }
});

router.get("/assets/style.css", (req, res) => {
  res.sendFile(path.resolve(__dirname, path.join(adminPanelDir, "style.css")));
});

router.get("/assets/script.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, path.join(adminPanelDir, "script.js")));
});


router.use("", (req, res) => res.status(404).json({error: "not found"}))


export { router }
