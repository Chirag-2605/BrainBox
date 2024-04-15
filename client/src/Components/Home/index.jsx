import styles from './styles.module.css';
import React from 'react'
import Sidebar from '../Sidebar/Sidebar';

const Home = () => {
    
    return (
        <div className={styles.home_container}>
            <div className={styles.sidebar_div}>
                <Sidebar></Sidebar>
            </div>
            <div className={styles.homepage}>
                Hii...I am home!!!
            </div>
        </div>
    )
}
export default Home
