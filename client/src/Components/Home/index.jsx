import styles from './styles.module.css';
import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import headerImg from '../../Assets/header-img.svg'

const Home = () => {
    return (
        <div className={styles.home_container}>
            <div className={styles.sidebar_div}>
                <Sidebar></Sidebar>
            </div>
            <div className={styles.homepage}>
                <div className={styles.homeContent}>
                    <h2 className={styles.homeContent_heading}>Getting Started</h2>
                    <p>👋 Welcome to BrainBox</p><br />
                    <p>Here are the basics: </p>
                    <ul>
                        <li>
                            <h3>📁 <strong>Documents</strong></h3>
                            <p>Get organized! Manage all your important files effortlessly in one spot. 📂 Upload, search, and access your docs in a snap! 🔍</p>
                        </li>
                        <li>
                            <h3>📋 <strong>To-Do</strong></h3>
                            <p>Stay on track with our To-Do list! ✅ Plan, add, and check off tasks as you conquer your day! 💪</p>
                        </li>
                        <li>
                            <h3>📅 <strong>Calendar</strong></h3>
                            <p>Never miss a beat! Schedule events, set reminders, and keep your day in check! 🕒</p>
                        </li>
                        <li>
                            <h3>📞 <strong>Contact</strong></h3>
                            <p>Need to get in touch? Visit our Contact page to reach us with any questions or concerns!</p>
                        </li>

                    <li>
                        <h3>💬 <strong>Feedback</strong></h3>
                        <p>We want to hear from you! Share your thoughts and suggestions on our Feedback page.</p>
                    </li>
                    <li><p>Stay connected with us on social media for the latest updates 🌐</p></li>
                    <li>
                        That's the rundown! You're all set to conquer your day! 🚀 Let us know if you have any questions—happy exploring!
                    </li>
                </ul>
                </div>
                <div className={styles.headerImg}>
                    <img src={headerImg} alt='headerImg' className={styles.header_image}></img>
                </div>
            </div>
        </div>
    )
}
export default Home
