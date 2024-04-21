import React from 'react'
import EarthCanvas from '../Planet/Earth';
import style from './style.module.css';
import StarsCanvas from '../Planet/Stars';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/navbar';

const Landing = () => {
    return (
    <div className={style.landing_container}>
        <Navbar></Navbar>
        <div className={style.stars}><StarsCanvas></StarsCanvas></div>
        <div className={style.land_container}>  
            <div className={style.land_container_content}>
                <h1 className={style.land_container_heading}>Welcome to BrainBox</h1><br /><br />
                <p> – your boundless digital playground where creativity thrives and organization reigns supreme. Dive into a world where ideas flow freely and productivity knows no bounds. With BrainBox, you wield the power to seamlessly capture, organize, and collaborate on your grandest visions and most intricate projects. Harness the potential of customizable workspaces and real-time collaboration tools to transform your wildest dreams into tangible realities. Say farewell to limitations and embrace the limitless possibilities of BrainBox. Welcome to a new era of productivity. </p>
            </div>
            <div className={style.earth}>
                <EarthCanvas></EarthCanvas>
            </div>
        </div>
        <Link to='/login'>
            <button className={style.btnLanding}>Start &rarr;</button>
        </Link>
    </div> 
    )
}

export default Landing
