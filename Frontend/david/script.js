let userName = "manuel"
let basedomain = "http://localhost:3000"
fetch(basedomain + '/api/time/' + userName)
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        document.getElementById('time-container').textContent = "Zeit: " + data.time;
        document.getElementById('Username-container').textContent = data.username;
      } else {
        document.getElementById('time-container').textContent = "Error";
      }
    })
    .catch(error => {
      document.getElementById('time-container').textContent = "Fehler beim Laden der Zeit";
      console.error(error);
    });


fetch(basedomain + "/api/task/all/" + userName)
    .then(response => response.json())
    .then(data => {
    const div = document.getElementById("task-list");
        if (Array.isArray(data)) {
            if (data.length == 0) {
            div.textContent = "Keine Aufgaben gefunden.";
            return;
            }

            let i = 0
            div.innerHTML = ""
            while (i < data.length) {
                console.log(data[i])
                console.log(i)
                div.innerHTML += "<p class=tasks>" + (i + 1) + ". " + data[i] + "</p>";
                div.innerHTML += '<button class=tasks-button onclick="userbutton(' + i + ')">Fertig</button>'
                i++
            }

        }
    })
    .catch(error => {
        document.getElementById('task-list').textContent = "Fehler beim Laden der Aufgaben.";
        console.error(error);
    });

  // Beispielhafte Funktion für "Fertig"-Button
async function userbutton(task) {
    console.log(`Task als fertig markieren: ${task}`);
    console.log(fetch(basedomain + "/api/task/done/" + userName + "/" + task))
    await delay(100);
    location.reload(true);

    //     .then(response => response.json())
    // Hier kannst du z. B. einen API-Aufruf machen:
    // fetch(`http://localhost:3000/api/task/done/${task.id}`, { method: 'POST' })
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}