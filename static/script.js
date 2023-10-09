import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

let signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  if (name.value == "" || password.value == "" || email.value == "") {
    alert("Ensure you input a value in all fields!");
  } else {
    const formData = new FormData(event.target);
  axios
    .post('http://3.24.150.175/users', {
      username: formData.get('name'),
      useremail: formData.get('email'),
      userpassword: formData.get('password'),
    }, {
      headers: {
        "Content-Type": "application/json",
        'Request-Date': new Date().toGMTString(),
      },
    })
    .then(res => {
      alert(JSON.stringify(res.data.data.user))
    })
    .catch(err => {
      alert(JSON.stringify(err.response.data.error))
    }); 

    name.value = "";
    email.value = "";
    password.value = "";
  }
});