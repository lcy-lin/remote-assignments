import './App.css';
import axios from 'axios';

function App() {
  async function onSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    axios.post('http://3.24.150.175:3000/users', {
        username: formData.get('name'),
        useremail: formData.get('email'),
        userpassword: formData.get('password'),
    },{
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
    })
  }
  return (
    <div className="App">
      <span className="wrapper">
            <p className="title">User Sign Up</p>
            <form className="formWrapper" id="signupForm" onSubmit={onSubmit}>
              <span className="block">
                <label>Name:</label>
                <input type="text" name="name" id="name"/>
              </span>
              <span className="block">
                <label>Email:</label>
                <input type="text" name="email" id="email"/>
              </span>
              <span className="block">
                <label>Password:</label>
                <input type="password" name="password" id="password"/>
              </span>
              <button type="submit" className="submitButton">
                Sign Up
              </button>
            </form>
          </span>
    </div>
  );
}

export default App;
