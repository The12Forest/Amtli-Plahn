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
