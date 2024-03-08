import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import axios from 'axios';
import React from 'react'
import Navbar from '../Navbar/navbar';
import loginImage from '../../Assets/login.png';

const Login = () => {
    const [data,setData] = useState({
        email : "",
        password : "",
    });
    const [error,setError] = useState("");

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name] : input.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/auth";
            const {data:res} = await axios.post(url,data);
            localStorage.setItem("token",res.data);
            window.location = "/"
        } catch (error) {
            if(error.response && error.response.status>=400 && error.response.status<=500){
                setError(error.response.data.message);
            }
        }
    }

    return (
        <>
        <Navbar></Navbar>
        <div className= {styles.login_container}>
            <div className= {styles.login_form_container}>
                <div className= {styles.left}>
                    <form className={styles.form_container}>
                        <h1>Login to your account</h1>
                        <input type='email' placeholder='Email' name='email' value={data.email} className={styles.input} onChange={handleChange}></input>
                        <input type='password' placeholder='Password' name='password' value={data.password} className={styles.input} onChange={handleChange}></input>
                        {/* Javascript for error */}
                        {error && <div className= {styles.error_msg}>
                            {error}
                        </div>}
                        <button type='submit' className={styles.green_btn} onClick={handleSubmit}>Sign in</button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>New here?</h1>
                    <Link to='/signup'>
                    <button type='button' className={styles.white_btn}>
                        Sign up
                    </button>
                    </Link>
                    
                </div>
            </div>
            <div className='image' style={{marginRight:'5rem'}}><img src={loginImage} alt="Logo" /></div>
        </div>
        </>
    )
}

export default Login;
