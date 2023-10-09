import styles from '../styles/signin.module.scss';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function SignUp() {
    async function onSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        axios.post('http://3.24.150.175:3001/users', {
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
            Swal.fire({
                title: "Success",
                text: JSON.stringify(res.data.data.user),
                icon: "success",
              });
        })
        .catch(err => {
            Swal.fire({
                title: "Error",
                text: err.response.data.error,
                icon: "error",
              });
        })
      }
     
    return (
        <span className={styles.wrapper}>
            <p className={styles.title}>User Sign Up</p>
            <form className={styles.formWrapper} onSubmit={onSubmit}>
                <span className={styles.block}>
                    <label>Name:</label>
                    <input type="text" name="name" />
                </span>
                <span className={styles.block}>
                    <label>Email:</label>
                    <input type="text" name="email" />
                </span>
                <span className={styles.block}>
                    <label>Password:</label>
                    <input type="password" name="password" />
                </span>
                <button type="submit" className={styles.submitButton} >
                    Sign Up
                </button>
            </form>
        </span>
    );
};