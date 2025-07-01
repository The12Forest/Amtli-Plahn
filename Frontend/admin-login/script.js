// let baseurl = "https://server5.techsvc.de:2007"
let baseurl = "https://localhost:2007"
let execute = true
let execute2 = true

document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target[0].value.trim();
  const password = e.target[1].value;

  if (!username || !password) {
    alert("Bitte Benutzername und Passwort eingeben.");
    return;
  }

  const combined = `${username}:${password}`;
  const hash = await sha256(combined);

  try {
    // Statt JSON bekommst du nun HTML zurück
    const response = await fetch(baseurl + "/api/login/" + hash);

    if (response.ok) {
      const html = await response.text();
      document.open();   
      document.write(html);    
      document.close();
    } else {
      alert("Zugang verweigert");
    }
  } catch (error) {
    console.error("Fehler beim Login:", error);
    alert("Login fehlgeschlagen.");
  }
});

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

async function adminresetpage() {
  const div = document.getElementById("login-containe");
  if (execute == true) {
    execute = false
    div.innerHTML = `
  <h2>Admin Reset</h2>
  <form class="AdminReset">
    <input type="text" placeholder="Reset-Code" id="resetcodeinput" required />
    <input type="text" placeholder="Username" id="usernameresetinput" required />
    <input type="password" placeholder="New password1" id="passwordreset1" required />
    <input type="password" placeholder="New password2" id="passwordreset2" required />
    <button class="resetbutton" id="resetbutton" onclick="adminreset(event)">Reset</button>
  </form>
  <button class="initiate_reset" id="initiate_reset" onclick="initiate_reset()">Generate Reset-Code</button>`
  }
}


async function initiate_reset() {
  const response = await fetch(baseurl + "/api/login/initate_passwordreset");
  if (response.ok) {
    alert("Reset-Code wurde erstellt und auf dem Server gespeichert. Bitte frage dienen Administrator ob er dir diesen aushändigen kann.")
  }
}



async function adminreset(event) {
  event.preventDefault();
  const div = document.getElementById("login-containe");
  resetcode = document.getElementById("resetcodeinput").value
  username = document.getElementById("usernameresetinput").value
  password1 = document.getElementById("passwordreset1").value
  password2 = document.getElementById("passwordreset2").value

  if (!resetcode || !username || !password1 || !password2) {
    if (execute2 == true) {
      execute2 = false
      // div.innerHTML += "Bitte fülle alle Felder!"
    }
    return;
  }

  if (password1 !== password2) {
    alert("Passwörter stimmen nicht überrein")
    return;
  }

  const combined = `${username}:${password1}`;
  const hash = await sha256(combined);

  let response = await fetch(baseurl + "/api/login/passwordreset/" + resetcode + "/" + username + "/" + hash)
  response = await response.json()

  if (!response.Okay) {
    alert("Error: " + response.reason)
  } else {
    await fetch(baseurl + "/login/save") 
    alert("Passwort erfolgreich geändert.")
    location.reload();
  }
} 
