let basedomain = "http://localhost:3000"

fetch(basedomain + "/api/user/all")
    .then(response => response.json())
    .then(data => {
    const div = document.getElementById("user-button");
        if (Array.isArray(data)) {
            if (data.length == 0) {
              div.textContent = "Keine User gefunden.";
              return;
            }

            let i = 0
            div.innerHTML = ""
            while (i < data.length) {
                console.log(data[i])
                console.log(i)
                div.innerHTML += '<button id="button-text" class="button-text" onclick="userbutton(' + i + ')">' + data[i] + '</button>'
                i++
            }

        }
    })
    .catch(error => {
        document.getElementById('task-list').textContent = "Fehler beim Laden der User.";
        console.error(error);
    });



function userbutton(element) {
  if (element == "1") {
    // console.log("David: ", David);
    window.location.href = "./../david/main.html";
  }
  if (element == "2") {
    // console.log("Silvan: ", Silvan);
    fetch("http://localhost:3000/api/admin/load")
  }
  if (element == "3") {
    // console.log("Manuel: ", Manuel);
  }
}
