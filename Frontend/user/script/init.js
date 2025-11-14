// let basedomain = "https://discord.techsvc.de:10108"
// let basedomain = "https://localhost:10108"
let basedomain = "https://10.10.20.155:10108"
let Username
let isGaming

window.addEventListener("load", start)


async function start() {
  await UpadteUsername();
  await time()
  await tasks()
  await isGamingUpdate()
  document.getElementById("Starttimebutton").addEventListener("click", Starttime)
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

      div.innerHTML = ""
      for (let i = 0; i < response.length; i++) {
        let taskDiv = document.createElement("div")
        taskDiv.className = "tasks"
        
        let taskName = document.createElement("span")
        taskName.className = "task-name"
        taskName.textContent = (i + 1) + ". " + response[i]
        taskDiv.appendChild(taskName)
        
        let taskTime = document.createElement("span")
        taskTime.className = "task-time"
        taskTime.textContent = "Time: " + response_times[i]
        taskDiv.appendChild(taskTime)
        
        div.appendChild(taskDiv)
        
        let button = document.createElement("button")  
        button.textContent = "Fertig"
        button.className = "tasks-button"
        button.addEventListener("click", () => userbutton(i))
        div.appendChild(button)
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