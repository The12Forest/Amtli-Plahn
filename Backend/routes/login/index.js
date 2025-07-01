import express from "express"
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router()
const logprefix = "LoginRouter:     "
const adminPanelDir = "../../../Frontend/admin";
const adminPanelPath = path.join(adminPanelDir, "main.html");
let passwords = []
let admin_usernames = []
let passwordreset = []

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



router.use("/save", (req, res) => {
  let buffer = JSON.stringify(passwords)
  fs.writeFileSync("./Backend/saves/passwords.json", buffer)
  buffer = JSON.stringify(admin_usernames)
  fs.writeFileSync("./Backend/saves/admin_usernames.json", buffer)
  //   console.log(logprefix + "Passwords saved:     " + JSON.stringify(passwords))
  console.log(logprefix + "Passwords saved:     " + '["Hidden"]')
  // console.log(logprefix + "Usernames saved:     " + JSON.stringify(admin_usernames))
  console.log(logprefix + "Username saved:      " + '["Hidden"]')
  res.send("Passwords Saved")
})

router.use("/load", (req, res) => {
  passwords = JSON.parse(fs.readFileSync("./Backend/saves/passwords.json"))
  admin_usernames = JSON.parse(fs.readFileSync("./Backend/saves/admin_usernames.json"))
  // console.log(logprefix + "Passwords loaded:  " + JSON.stringify(passwords))
  console.log(logprefix + "Passwords loaded:     " + '["Hidden"]')
  // console.log(logprefix + "Passwordresets loaded:  " + JSON.stringify(admin_usernames))
  console.log(logprefix + "Usernames loaded:     " + '["Hidden"]')
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

router.get("/initate_passwordreset", (req, res) => {
  let randrom_id = makeid(20);
  passwordreset.push(randrom_id);
  res.json({"OK":true})
})

router.get("/passwordreset/:resetstr/:username/:newpasswd", (req, res) => {  
  let resetpresent = passwordreset.indexOf(req.params.resetstr)
  let userid = admin_usernames.indexOf(req.params.username)
  if (resetpresent !== -1) {
    if (userid !== -1) {
      passwordreset.splice(resetpresent)
      passwords[userid] = req.params.newpasswd
      res.json({"OK":true})
    } else {
      res.json({"OK":false, "reason":"Username not valid!"})
    }
  } else {
    res.json({"OK":false, "reason":"Reset-Code not valid!"})
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
