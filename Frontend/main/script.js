// let basedomain = "http://server5.techsvc.de:2007"
let basedomain = "http://localhost:2007"


fetch(basedomain + "/api/user/all")
    .then(response => response.json())
    .then(data => {
    const div = document.getElementById("user-button");
        if (Array.isArray(data)) {
            if (data.length == 0) {
              div.textContent = "No user found.";
              return;
            }

            let i = 0
            div.innerHTML = ""
            while (i < data.length) {
                console.log(data[i])
                console.log(i)
                div.innerHTML += '<button id="button-text" class="button-text" onclick=\'userbutton("' + data[i] + '")\'>' + data[i] + '</button>'

                i++
            }

        }
    })
    .catch(error => {
        document.getElementById('task-list').textContent = "Failed to load user.";
        console.error(error);
    });


async function adminbutton() {
    window.location.href = (basedomain + "/admin");
}


async function userbutton(element) {
  let response = await fetch(basedomain + "/api/temp/set/" + element);  let data = await response.text();
  console.log(data + ":" + element);
  window.location.href = (basedomain + "/user");
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
