let baseurl = "http://server5.techsvc.de:2007"
// let baseurl = "http://localhost:2007"


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
    const response = await fetch(baseurl + "/api/login/" + hash + "/");
    const data = await response.json();

    if (data.ok && data.login) {
      window.location.href = "/admin-panel.html";
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