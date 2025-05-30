let userName
let basedomain = "https://server5.techsvc.de:2007"
// let basedomain = "https://localhost:2007"


fetch(basedomain + "/api/temp/get")
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      userName = String(data.set);
    } else {
      userName = null;
    }
    
//! Start other code

    fetch(basedomain + '/api/time/' + userName)
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          UserNameUppercase = data.username.charAt(0).toUpperCase() + data.username.slice(1);
          document.getElementById('time-container').textContent = "Zeit: " + data.time;
          document.getElementById('Username-container').textContent = UserNameUppercase;
        } else {
          document.getElementById('time-container').textContent = "Error";
        }
      })
      .catch(error => {
        document.getElementById('time-container').textContent = "Failed to lode time.";
        console.error(error);
      });


    fetch(basedomain + "/api/task/all/" + userName)
      .then(response => response.json())
      .then(data => {
      const div = document.getElementById("task-list");
        if (Array.isArray(data)) {
          if (data.length == 0) {
          div.textContent = "No tasks found.";
          return;
          }

          let i = 0
          div.innerHTML = ""
          while (i < data.length) {
              div.innerHTML += "<p class=tasks>" + (i + 1) + ". " + data[i] + "</p>";
              div.innerHTML += '<button class=tasks-button onclick="userbutton(' + i + ')">Fertig</button>'
              i++
          }
        }
      })
      .catch(error => {
          document.getElementById('task-list').textContent = "Failed to load tasks.";
          console.error(error);
      });

//! End other code

  })
  .catch(err => console.error("Fetch error:", err));




async function userbutton(task) {
    fetch(basedomain + "/api/task/done/" + userName + "/" + task)
    reloadtask()
}


async function reloadtask() {
  fetch(basedomain + '/api/time/' + userName)
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          UserNameUppercase = data.username.charAt(0).toUpperCase() + data.username.slice(1);
          document.getElementById('time-container').textContent = "Zeit: " + data.time;
          document.getElementById('Username-container').textContent = UserNameUppercase;
        } else {
          document.getElementById('time-container').textContent = "Error";
        }
      })
      .catch(error => {
        document.getElementById('time-container').textContent = "Failed to lode time.";
        console.error(error);
      });


    fetch(basedomain + "/api/task/all/" + userName)
      .then(response => response.json())
      .then(data => {
      const div = document.getElementById("task-list");
        if (Array.isArray(data)) {
          if (data.length == 0) {
          div.textContent = "No tasks found.";
          return;
          }

          let i = 0
          div.innerHTML = ""
          while (i < data.length) {
              div.innerHTML += "<p class=tasks>" + (i + 1) + ". " + data[i] + "</p>";
              div.innerHTML += '<button class=tasks-button onclick="userbutton(' + i + ')">Fertig</button>'
              i++
          }
        }
      })
      .catch(error => {
          document.getElementById('task-list').textContent = "Failed to load tasks.";
          console.error(error);
      });
  
}