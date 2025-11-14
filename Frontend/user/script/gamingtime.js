async function isGamingUpdate() {
  const div = document.getElementById("Starttimebutton");
  let response = await fetch(basedomain + "/api/time/isgaming/" + Username)
  response = await response.json()
  if (response.Okay) {
    isGaming = response.IsGaming
    if (isGaming) {
      div.innerHTML = "Stop Gaming"
    } else {
      div.innerHTML = "Start Gaming"
    }
  }
}

async function Starttime() {
  await fetch(basedomain + "/api/time/isgaming/" + Username + "/" + !isGaming)
  await new Promise(r => setTimeout(r, 100));
  await isGamingUpdate()
  if (isGaming) {
    Timeupdatewhilegaming()
  }
}

async function Timeupdatewhilegaming() {
  alert("Gamingtime started")
  while (isGaming) {
    await new Promise(r => setTimeout(r, 60000));
    await time()
    await isGamingUpdate()
  }
  alert("Gaming Stoped!")
}
