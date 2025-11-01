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
  passwordreset = JSON.parse(fs.readFileSync("./Backend/saves/admin_usernames.json"))
  // console.log(logprefix + "Passwords loaded:  " + JSON.stringify(passwords))
  console.log(logprefix + "Passwords loaded:     " + '["Hidden"]')
  // console.log(logprefix + "Passwordresets loaded:  " + JSON.stringify(admin_usernames))
  console.log(logprefix + "Usernames loaded:     " + '["Hidden"]')
  res.send("Passwords loaded")  
})

router.get("/create/:passwdold/:newusername/:passwd", (req, res) => {
  let passwdIndex = passwords.indexOf(req.params.passwdold);
  if (passwdIndex !== -1) {
    let userid = admin_usernames.indexOf(req.params.newusername)
    if (userid == -1) {
      admin_usernames.push(req.params.newusername)
      passwords.push(req.params.passwd)
      console.log(logprefix + "Creating password for admin: " + passwords.indexOf(req.params.passwdold))
      res.send("Password was added.")
    } else { 
      console.log(logprefix + "Creating admin: But the password: " + req.params.passwd + " already exists.")
      res.status(401).json({"Okay":false, "reason":"Admin already exists."});
    }
  } else {
    console.log(logprefix + "Admin user tried to create new Admin but the username/password was wrong.");
    res.status(401).json({"Okay":false, "reason":"Wrong existing Admin/Password."});
  }
})

router.get("/delete/:passwd", (req, res) => {
  if (passwords.length > 1) {
    let userid = passwords.indexOf(req.params.passwd)
    if (userid !== -1) {
      console.log(logprefix + "Deleting admin: " + admin_usernames[passwords.indexOf(req.params.passwdold)])
      passwords.splice(userid)
      res.json({"ok": true, "successful": true})
    } else { 
      console.log(logprefix + "Deleting admin: But the password: " + req.params.passwd + " dose not exists.")
      res.json({"ok": false, "successful": false})  
    }
  } else {
    console.log(logprefix + "Deleting admin: But the last admin: \"" + admin_usernames[passwords.indexOf(req.params.passwdold)] + "\" cant be deleted.")
    res.json({"ok": false, "successful": false})  
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
  let random_id = makeid(10);
  passwordreset.push(random_id);
  let buffer = JSON.stringify(passwordreset)
  fs.writeFileSync("./Reset-Codes.json", buffer)
  console.log(logprefix + 'Admin-Password-Reset-Code was generated, it was: ' + JSON.stringify(random_id))
  res.json({"OK":true})
})

router.get("/passwordreset/:resetstr/:username/:newpasswd", (req, res) => {  
  let resetpresent = passwordreset.indexOf(req.params.resetstr)
  let userid = admin_usernames.indexOf(req.params.username)
  if (resetpresent !== -1) {
    if (userid !== -1) {
      passwordreset.splice(resetpresent)
      passwords[userid] = req.params.newpasswd
      let buffer = JSON.stringify(passwordreset)
      fs.writeFileSync("./Reset-Codes.json", buffer)
      console.log(logprefix + "Admin-Password-Reset-Code: " + JSON.stringify(req.params.resetstr) + " was used.")
      console.log(logprefix + "The admin password of User: " + req.params.username + " with ID: " + JSON.stringify(userid) + " was changed to " + JSON.stringify(req.params.newpasswd));
      res.json({"Okay":true})
    } else {
      console.log(logprefix + "Someone tried to change the Admin-Password but the wrong User: " + JSON.stringify(req.params.username) + " was put in.")
      res.json({"Okay":false, "reason":"Username not valid!"})
    }
  } else {
    console.log(logprefix + "Someone tried to change password of User: " + JSON.stringify(req.params.username) + " but the wrong reset code was used.")
    res.json({"Okay":false, "reason":"Reset-Code not valid!"})
  }
})

router.get("/check/:passwd", (req, res) => {
  let adminid = passwords.indexOf(req.params.passwd);
  if (adminid !== -1) {
    res.json({"Okay": true})
  } else {
    res.send({"Okay": false})
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


router.use("", (res) => res.status(404).json({error: "not found"}))


export { router }
