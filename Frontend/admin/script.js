async function populateDropdownUser() {
  try {
    const response = await fetch(baseurl + "/api/user/all");
    const names = await response.json();
    const dropdowns = document.getElementsByClassName('UserSelect');
    for (let dropdown of dropdowns) {
      dropdown.innerHTML = '';
      names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        dropdown.appendChild(option);
      });
      populatetask(document.getElementById("UserSelectTaskDelete").value)
      timesetupdate(document.getElementById("UserSelectTimeSet").value, "TimeSetInput")
      timesetupdate(document.getElementById("UserSelectTimeAdd").value, "TimeAddInput")
    }
  } catch (error) {
    console.error('Error fetching user dropdown data:', error);
  }
}

async function populatetask(selectedValue) {
  try {
    const response = await fetch(baseurl + "/api/task/all/" + selectedValue);
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

async function timesetupdate(user, element) {
  const response = await fetch(baseurl + "/api/time/" + user);
  const data = await response.json();
  const time = data.time;
  const input = document.getElementById(element);
  input.placeholder = `Time now ${time} in min.`; 
}


async function createTask() {
  const userDropdown = document.getElementById('UserSelectTaskCreate');
  const username = userDropdown.value;
  const text = document.getElementById("Taskname-create");
  const taskname = text.value;
  try {
    await fetch(baseurl + "/api/task/create/" + username + "/" + encodeURIComponent(taskname));
    showFeedback("Task created successfully!", true);
  } catch (error) {
    console.error("Error creating task:", error);
    showFeedback("Failed to create task!", false);
  }
  populatetask(document.getElementById("UserSelectTaskDelete").value)
}

async function deleteTask() {
  const value = document.getElementById('UserSelectTaskDelete');
  const value1 = value.value;
  const username = value1.charAt(0).toLowerCase() + value1.slice(1);
  const taskDropdown = document.getElementById("TaskSelectDel");
  const taskname = taskDropdown.value;
  try {
    await fetch(baseurl + "/api/task/del/" + username + "/" + taskname);
    showFeedback("Task successfully deleted!", true);
  } catch (error) {
    console.error("Error deleting task:", error);
    showFeedback("Failed to delete task!", false);
  }
  populatetask(document.getElementById("UserSelectTaskDelete").value)
}

async function setTime() {
  user = document.getElementById("UserSelectTimeSet").value
  time = document.getElementById("TimeSetInput").value
  if (await fetch(baseurl + "/api/time/set/" + user + "/" + time)) {
    showFeedback("Time set successfully!", ture)
  } else {
    showFeedback("Failed to set Time!", flase)
  }
  timesetupdate(document.getElementById("UserSelectTimeSet").value, "TimeSetInput")
  timesetupdate(document.getElementById("UserSelectTimeAdd").value, "TimeAddInput")
}

async function addTime() {
  user = document.getElementById("UserSelectTimeAdd").value
  time = document.getElementById("TimeAddInput").value
  if (await fetch(baseurl + "/api/time/" + user + "/" + time)) {
    showFeedback("Time added successfully!", ture)
  } else {
    showFeedback("Failed to add time!", flase)
  }
  timesetupdate(document.getElementById("UserSelectTimeSet").value, "TimeSetInput")
  timesetupdate(document.getElementById("UserSelectTimeAdd").value, "TimeAddInput")
}

async function addUser() {
  user = document.getElementById("AddUserInput").value
  if (await fetch(baseurl + "/api/user/add/" + user)) {
    showFeedback("User added successfully!", ture)
  } else {
    showFeedback("Failed to add user!", flase)
  }
  populateDropdownUser()
}

async function delUser() {
  user = document.getElementById("DelUserInput").value
  if (await fetch(baseurl + "/api/user/del/" + user)) {
    showFeedback("User successfully deleted!", ture)
  } else {
    showFeedback("Failed to delete user!", flase)
  }
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
  if (await fetch(baseurl + "/api/login/update/" + hashold + "/" + hashnew)) {
    showFeedback("Admin passwd successfully updated!", ture)
  } else {
    showFeedback("Failed to update admin passwd!", flase)
  }
}

async function addAdmin() {

  let username = document.getElementById("NewAdminUser").value;
  let passwd = document.getElementById("NewAdminPass").value;

  if (!username || !passwd) {
    alert("Bitte Benutzername und Passwort eingeben.");
    return;
  }

  let combinednew = `${username}:${passwd}`;
  let hashnewuser = await sha256(combinednew);

  if (await fetch(baseurl + "/api/login/create/" + hashnewuser)) {
    showFeedback("Admin user successfully added!", ture)
  } else {
    showFeedback("Failed to add admin user!", flase)
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

  if (  await fetch(baseurl + "/api/login/create/" + hashdeluser)) {
    showFeedback("Admin user successfully deleted!", ture)
  } else {
    showFeedback("Failed to delete admin user!", flase)
  }
}

function showFeedback(message, isSuccess = true) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.style.backgroundColor = isSuccess ? "#4CAF50" : "#f44336";
  feedback.style.opacity = "1";
  feedback.style.transform = "translateY(0)";

  setTimeout(() => {
    feedback.style.opacity = "0";
    feedback.style.transform = "translateY(20px)";
  }, 3000);
}

async function loadsetting() {
  if (await fetch(baseurl + "/api/storage/load")) {
    showFeedback("Settings successfully loaded!", ture)
  } else {
    showFeedback("Failed to load settings!", flase)
  }
  populateDropdownUser()
}

async function savesetting() {
  if (  await fetch(baseurl + "/api/storage/save")) {
    showFeedback("Settings successfully saved!", ture)
  } else {
    showFeedback("Failed to save settings!", flase)
  }
}

document.getElementById("UserSelectTaskDelete").addEventListener("change", function () {
  populatetask(this.value, "UserSelectTaskDelete");
});

document.getElementById("UserSelectTimeSet").addEventListener("change", function () {
  timesetupdate(this.value, "TimeSetInput");
});

document.getElementById("UserSelectTimeAdd").addEventListener("change", function () {
  timesetupdate(this.value, "TimeAddInput");
});


populateDropdownUser()
