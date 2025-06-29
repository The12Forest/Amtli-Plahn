let baseurl = "https://server5.techsvc.de:2007"
// let baseurl = "https://localhost:2007"


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