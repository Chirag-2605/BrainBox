import styles from './styles.module.css';
import Navbar from '../Navbar/navbar';
import React from 'react'

const Home = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <div className={styles.home_container}>
            <Navbar></Navbar>
            Hii...I am home!!!
        </div>
    )
}

export default Home
