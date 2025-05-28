// let baseurl = "https://server5.techsvc.de:2007"
// let baseurl = "https://localhost:2007"



async function populateDropdown() {
  try {
    const response = await fetch(baseurl + "/api/user/all"); 
    const names = await response.json(); 
    const dropdown = document.getElementById('userselect');
    dropdown.innerHTML = '';

    names.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
  }
}

async function adduser() {
  const dropdown = document.getElementById('userselect');
  const username = dropdown.value;
  const textarea = document.getElementById("Taskname-create");
  const taskname = textarea.value;
  fetch(baseurl + "/api/task/create/" + username + "/" + taskname + "/")
  
}

populateDropdown();

