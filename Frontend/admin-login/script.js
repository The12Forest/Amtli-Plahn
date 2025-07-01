// let baseurl = "https://server5.techsvc.de:2007"
let baseurl = "https://localhost:2007"
let execute = true

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
    const response = await fetch(baseurl + "/api/login/" + hash + "/");

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

async function initiate_adminreset() {
  console.log("Pressed")
  try {
    const div = document.getElementById("login-containe");
    const response = await fetch(baseurl + "/api/login/initate_passwordreset");
    if (response.ok) {
      if (execute == true) {
        execute = false
        div.innerHTML = `
      <h2>Admin Reset</h2>
      <form class="AdminReset">
        <input type="text" placeholder="Reset-Code" required />
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="New password1" required />
        <input type="password" placeholder="New password2" required />
        <button type="reset" class="resetbutton">Reset</button>
      </form>`
      }
    } else {
      alert("Passwordhash `wurde in der Server directory gespeichert. Bitte kontaktire deinen Administrator um die wiederherstellung des Kontos fertig zu stellen.")
    }
  } catch (error) {
    console.error("Fehler beim Login:", error);
    alert("Login fehlgeschlagen.");
  }//! Conect it to the backend
}