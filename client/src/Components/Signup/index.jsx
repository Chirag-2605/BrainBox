import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import axios from 'axios';
import Navbar from '../Navbar/navbar';
import signupImage from '../../Assets/signup.png';


import React from 'react'

const Signup = () => {
    const [data,setData] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        phone : "",
    });
    const [error,setError] = useState("");

    const navigate = useNavigate()

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name] : input.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/user";
            const {data:res} = await axios.post(url,data);
            navigate("/login");
            console.log(res.message); 
        } catch (error) {
            if(error.response && error.response.status>=400 && error.response.status<=500){
                setError(error.response.data.message);
            }
        }
    }

    return (
        <>
        <Navbar></Navbar>
        <div className= {styles.signup_container}>
            <div className='image' ><img src={signupImage} alt="Logo" style={{marginLeft:'2rem', height:'35rem', width:'35rem', marginTop:'-2rem'}} /></div>
            <div className= {styles.signup_form_container}>
                <div className= {styles.left}>
                    <h1>Welcome back!</h1>
                    <Link to='/login'>
                    <button type='button' className={styles.white_btn}>
                        Sign in
                    </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container}>
                        <h1>Create Account</h1>
                        <input type='text' placeholder='First Name' name='firstName' value={data.firstName} className={styles.input} onChange={handleChange}></input>
                        <input type='text' placeholder='Last Name' name='lastName' value={data.lastName} className={styles.input} onChange={handleChange}></input>
                        <input type='email' placeholder='Email' name='email' value={data.email} className={styles.input} onChange={handleChange}></input>
                        <input type='number' placeholder='Mobile number' name='phone' value={data.phone} className={styles.input} onChange={handleChange}></input>
                        <input type='password' placeholder='Password' name='password' value={data.password} className={styles.input} onChange={handleChange}></input>
                        {/* Javascript for error */}
                        {error && <div className= {styles.error_msg}>
                            {error}
                        </div>}
                        <button type='submit' className={styles.green_btn} onClick={handleSubmit}>Signup</button>
                    </form>
                </div>
            </div>
        </div>
    </>
    )
}

export default Signup
