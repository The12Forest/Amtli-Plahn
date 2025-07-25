let basedomain = "https://server5.techsvc.de:2007"
// let basedomain = "https://localhost:2007"
let Username
let isGaming

async function start() {
  await UpadteUsername();
  await time()
  await tasks()
  await isGamingUpdate()
  // Timeupdatewhilegaming()
}

async function UpadteUsername() {
  Username = document.cookie.split('; ').find(row => row.startsWith('username='))?.split('=')[1];

  if (Username) {
    UserNameUppercase = Username.charAt(0).toUpperCase() + Username.slice(1);
    document.getElementById('Username-container').textContent = UserNameUppercase;
    document.getElementById('title').textContent = UserNameUppercase + " Ämtli"
  } else {
    console.log("Get username from cookie did not work")
  }
}

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
  alert("No time left!")
}

async function time() {
  try {
    let response = await fetch(basedomain + '/api/time/' + Username);
    response = await response.json()
    document.getElementById('time-container').textContent = "Zeit: " + response.time;
  } catch (error) {
    document.getElementById('time-container').textContent = "Failed to lode time.";
    console.error(error);
  }
}

async function tasks() {
  try {
    let response = await fetch(basedomain + "/api/task/all/" + Username + "/" + (new Date().getDay()))
    let response_times = await fetch(basedomain + "/api/task/timesall/" + Username + "/" + (new Date().getDay()))
    response = await response.json()
    response_times = await response_times.json()

    const div = document.getElementById("task-list");
    if (Array.isArray(response)) {
      if (response.length == 0) {
        div.textContent = "No tasks found.";
        return;
      }

      let i = 0
      div.innerHTML = ""
      while (i < response.length) {
        div.innerHTML += "<p class=tasks>" + (i + 1) + ". " + response[i] + " <br><br>Time: " + response_times[i] + "</p>";
        div.innerHTML += '<button class=tasks-button onclick="userbutton(' + i + ')">Fertig</button>'
        i++
      }
    } else {
      console.error("Not array for tasks returned: ", response)
    }
  } catch (error) {
    document.getElementById('task-list').textContent = "Failed to load tasks.";
    console.error(error);
  }
}

async function reloadtask() {
  await time()
  await tasks()
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function userbutton(task) {
    fetch(basedomain + "/api/task/done/" + Username + "/" + (new Date().getDay()) + "/" + task);
    await delay(2);
    reloadtask();
}



start()

