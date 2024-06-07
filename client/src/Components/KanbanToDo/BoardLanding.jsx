import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import './kanban.css'
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import {jwtDecode} from 'jwt-decode';
// ANIMATION
import Lottie from "lottie-react"
import animationRocketData from '../../Assets/animations/rocket.json';
import animationAstroData from '../../Assets/animations/Astronaut.json';
import animationArrowLeftData from '../../Assets/animations/arrowLeft.json';

const BoardLanding = () => {
    const [docName, setDocName] = useState();
    const [documents, setDocuments] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId || decodedToken._id;
                setUserId(userId);
            } catch(err) {
                console.log("error while fetching token: ", err)
            }
        }
        async function fetchDocuments() {
            try {
                const response = await axios.get(`http://localhost:8080/api/all-kanban-todos/${userId}`);
                setDocuments(response.data);
            } catch (error) {
                console.log("Error fetching docs: ", error);
            }
        }
        fetchDocuments();
    }, [userId]);

    return (
        <>
        <div className='docLandingContainer'>
            <div className='sidebar_section'>
                <Sidebar></Sidebar>
            </div>
            <div className='doc_section'>
                <div className='animationPane'>
                    <Lottie animationData={animationRocketData} className='rocketAnimation'></Lottie>
                    <Lottie animationData={animationAstroData} className='astroAnimation'></Lottie>
                    <Lottie animationData={animationArrowLeftData} loop={false} className='arrowLeftAnimation'></Lottie>
                </div>
                <div className='create-doc'>
                    <p className='docCreateHeading'>Create Kanban Boards</p>
                    <h2>Create a new Kanban Board </h2>
                    <div>
                        <span>
                            <input 
                                className='docInput'
                                type='text' 
                                value={docName}
                                placeholder='Type the title here...' 
                                onChange={(event) => setDocName(event.target.value)}
                            />
                        </span>
                        <span>
                            <Link to={`/board/${userId}/${docName}/${uuidV4()}`}>
                                <button type='button' className='docCreateBtn'>
                                    Create Kanban Board &#8594;
                                </button>
                            </Link>
                        </span>
                        <span style={{color:'white', fontSize:'1.3rem'}}>&nbsp;&nbsp;Or</span>
                        <span>
                            <Link to={`/board/${userId}/${docName}/${uuidV4()}/room`}>
                                <button type='button' className='docCreateBtn'>
                                    Create Room &#8594;
                                </button>
                            </Link>
                        </span>
                    </div>
                    <h2>Or choose from Custom Templates</h2>
                    <div className='templateSection'></div>
                </div>
                <div className='display-docs'>
                    <p className='docDisplayHeading'>Your Kanban Boards</p>
                    <Swiper
                        spaceBetween={1} // Space between slides
                        slidesPerView={5} // Number of slides visible at a time
                        navigation
                        pagination={{ clickable: true }} // Optional pagination
                    >
                        {documents.map(doc => (
                            <SwiperSlide key={doc._id}>
                                <Link to={`/board/${userId}/${doc.title}/${doc._id}`}>
                                    <div className='doc-container'>
                                        <div className='doc-img'></div>
                                        <div className='doc-name'>{doc.title}</div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
        </>
    );
};

export default BoardLanding;