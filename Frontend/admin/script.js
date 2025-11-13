function getDayValue(id) {
  let dropdown = document.getElementById(id).value;
  if (dropdown == 7) {
    dropdown = new Date().getDay();
  }
  return dropdown;
}

async function populateDropdownUser() {
  try {
    const response = await fetch(basedomain + "/api/user/all");
    const names = await response.json();
    const dropdowns = document.getElementsByClassName('UserSelect');
    for (let dropdown of dropdowns) {
      dropdown.innerHTML = '';
      names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        dropdown.appendChild(option);
      })
    }
    populatetask()
    timesetupdate(document.getElementById("UserSelectTimeSet").value, "TimeSetInput")
    timesetupdate(document.getElementById("UserSelectTimeAdd").value, "TimeAddInput")
  } catch (error) {
    console.error('Error fetching user dropdown data:', error);
  }
}

async function populatetask() {
  try {
    const user = document.getElementById("UserSelectTaskDelete").value;
    const day = getDayValue("DaySelectTaskDelete");
    const response = await fetch(basedomain + "/api/task/all/" + user + "/" + day);
    const tasks = await response.json();
    const dropdowns = document.getElementsByClassName('TaskSelectDel');
    for (let dropdown of dropdowns) {
      dropdown.innerHTML = '';
      tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task;
        option.textContent = task;
        dropdown.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error fetching task dropdown data:', error);
  } 
}


async function createTask() {
  const username = document.getElementById('UserSelectTaskCreate').value;
  const taskname = document.getElementById("Taskname-create").value;
  const time = document.getElementById("TaskTime").value;
  const day = getDayValue("DaySelectTaskCreate");
  if (taskname == "") {
    alert("Fill alltextboxes")
    return
  }
  if (time == "") {
    alert("Fill alltextboxes")
  }
  try {
    await fetch(basedomain + "/api/task/create/" + username + "/" + day + "/" + time + "/" + encodeURIComponent(taskname) + "/" + hash);
  } catch (error) {
    console.error("Error creating task:", error);
  }
  populatetask()
}

async function deleteTask() {
  const value = document.getElementById('UserSelectTaskDelete').value;
  const day = getDayValue("DaySelectTaskDelete");
  const username = value.charAt(0).toLowerCase() + value.slice(1);
  const taskDropdown = document.getElementById("TaskSelectDel");
  const taskname = taskDropdown.value;
  if (taskname == "") {
    alert("Nothing selected")
  } else {
    try {
      await fetch(basedomain + "/api/task/del/" + username + "/" + day + "/" + taskname);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
  populatetask()
}


async function timesetupdate(user, element) {
  const response = await fetch(basedomain + "/api/time/" + user);
  const data = await response.json();
  const time = data.time;
  const input = document.getElementById(element);
  input.placeholder = `Time now ${time} min.`; 
}

async function setTime() {
  user = document.getElementById("UserSelectTimeSet").value
  time = document.getElementById("TimeSetInput").value
  await fetch(basedomain + "/api/time/set/" + user + "/" + time);
  timesetupdate(document.getElementById("UserSelectTimeSet").value, "TimeSetInput")
  timesetupdate(document.getElementById("UserSelectTimeAdd").value, "TimeAddInput")
}

async function addTime() {
  user = document.getElementById("UserSelectTimeAdd").value
  time = document.getElementById("TimeAddInput").value
  await fetch(basedomain + "/api/time/" + user + "/" + time);
  timesetupdate(document.getElementById("UserSelectTimeSet").value, "TimeSetInput")
  timesetupdate(document.getElementById("UserSelectTimeAdd").value, "TimeAddInput")
}

async function addUser() {
  user = document.getElementById("AddUserInput").value
  await fetch(basedomain + "/api/user/add/" + user);
  populateDropdownUser()
}

async function delUser() {
  user = document.getElementById("DelUserInput").value
  await fetch(basedomain + "/api/user/del/" + user);
  populateDropdownUser()
}

async function changePasswd() {

  let usernameold = document.getElementById("AdminUsername").value;
  let passwordold = document.getElementById("OldPassword").value;
  let passwordnew1 = document.getElementById("NewPassword1").value;
  let passwordnew2 = document.getElementById("NewPassword2").value;

  if (passwordnew1 !== passwordnew2) {
    alert("Passwörter stimmen nicht überrein.");
    return;
  }

  if (!usernameold || !passwordold) {
    alert("Bitte Benutzername und Passwort eingeben.");
    return;
  }

  let combinedold = `${usernameold}:${passwordold}`;
  let combinednew = `${usernameold}:${passwordnew1}`;
  let hashold = await sha256(combinedold);
  let hashnew = await sha256(combinednew);
  await fetch(basedomain + "/api/login/update/" + hashold + "/" + hashnew);
}

async function addAdmin() {
  let usernamecheck = document.getElementById("CurrentAdminNameCreate").value;
  let passwdcheck = document.getElementById("CurrentAdminPWCreate").value;

  let username = document.getElementById("NewAdminUser").value;
  let passwd = document.getElementById("NewAdminPass").value;

  if (!username || !passwd) {
    alert("Bitte Benutzername und Passwort eingeben.");
    return;
  }

  if (!usernamecheck || !passwdcheck) {
    alert("Bitte jetzigen Username und Passwort eingeben.");
    return;
  }
  let combinedcheck = `${usernamecheck}:${passwdcheck}`;
  let combinednew = `${username}:${passwd}`;
  let hashusercheck = await sha256(combinedcheck);
  let hashnewuser = await sha256(combinednew);

  let response = await fetch(basedomain + "/api/login/create/" + hashusercheck + "/" + username + "/" + hashnewuser);
  if (response.ok) {
    alert("Admin successfully created")
  } else {
    reason = await response.json();
    alert("Error: " + reason.reason)
  }
}


async function delAdmin() {
  let username = document.getElementById("DelAdminName").value;
  let passwd = document.getElementById("DelAdminPass").value;

  if (!username || !passwd) {
    alert("Bitte Benutzername und Passwort eingeben.");
    return;
  }

  let combineddel = `${username}:${passwd}`;
  let hashdeluser = await sha256(combineddel);

  await fetch(basedomain + "/api/login/delete/" + hashdeluser);
}

async function logout() {
  document.cookie = "userhash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = '/';
}

async function loadsetting() {
  await fetch(basedomain + "/api/storage/load")
  populateDropdownUser()
}

async function savesetting() {
  await fetch(basedomain + "/api/storage/save")
}

async function saveshutdownsetting() {
  await fetch(basedomain + "/api/task/load")
  await fetch(basedomain + "/api/storage/save")
  await fetch(basedomain + "/api/shutdown")
}

window.onload = function () {
  document.getElementById("UserSelectTaskDelete").addEventListener("change", function () {
    populatetask(this.value, "UserSelectTaskDelete");
  });

  document.getElementById("UserSelectTimeSet").addEventListener("change", function () {
    timesetupdate(this.value, "TimeSetInput");
  });

  document.getElementById("UserSelectTimeAdd").addEventListener("change", function () {
    timesetupdate(this.value, "TimeAddInput");
  });

  document.getElementById("DaySelectTaskDelete").addEventListener("change", function () {
    populatetask();
  });
};




async function start() {
  if (document.cookie.split(';').some(cookie => cookie.trim().startsWith('userhash='))) {
    const div = document.getElementById("body");
    div.innerHTML += `
      <div class="logoutbutton">
        <div class="logout" id="logoutdiv">
          <label>Logout and delete Cookie:</label>
          <button onclick="logout()">Logout</button>
        </div>
      </div>`
  }

  populateDropdownUser()
}

start()
//! Only show button wen coockie is there and but it in a other div and make it functioning 