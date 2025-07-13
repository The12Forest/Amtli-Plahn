let basedomain = "https://server5.techsvc.de:2007"
// let basedomain = "https://localhost:2007"


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
                UserNameUppercase = data[i].charAt(0).toUpperCase() + data[i].slice(1);
                div.innerHTML += '<button id="button-text" class="button-text" onclick=\'userbutton("' + data[i] + '")\'>' + UserNameUppercase + '</button>'
                i++
            }

        }
    })
    .catch(error => {
        document.getElementById('task-list').textContent = "Failed to load user.";
        console.error(error);
    });


async function adminbutton() {
    window.location.href = '/admin';
}


async function userbutton(element) {
    document.cookie = "username=" + element + "; path=/";
    window.location.href = '/user';
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
