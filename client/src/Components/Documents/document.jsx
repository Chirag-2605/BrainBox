// Landing.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import './document.css'
import axios from 'axios';
// import Sidebar from '../Sidebar/Sidebar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const Landing = () => {
    const [docName, setDocName] = useState();
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const response = await axios.get(`http://localhost:8080/documents`);
                setDocuments(response.data);
            } catch (error) {
                console.log("Error fetching docs: ", error);
            }
        }
        fetchDocuments();
    }, [])

    return (
        <>
        <div className='docLandingContainer'>
            <div className='display-docs'>
                <p className='docDisplayHeading'>Your Documents</p>
                <Swiper
                    spaceBetween={1} // Space between slides
                    slidesPerView={6} // Number of slides visible at a time
                    navigation
                    pagination={{ clickable: true }} // Optional pagination
                >
                    {documents.map(doc => (
                        <SwiperSlide key={doc._id}>
                            {/* Link to each document's page */}
                            <Link to={`/documents/${doc.name}/${doc._id}`}>
                                <div className='doc-container'>
                                    <div className='doc-img'></div>
                                    <div className='doc-name'>{doc.name}</div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='create-doc'>
                <p className='docCreateHeading'>Create Documents</p>
                <h2>Tell the name of your document</h2>
                <input 
                    type='text' 
                    value={docName} 
                    onChange={(event) => setDocName(event.target.value)}
                />
                <Link to={`/documents/${docName}/${uuidV4()}`}>
                    <button type='button' className='landingBtn'>
                        Create Document &#8594;
                    </button>
                </Link>
            </div>
        </div>
        </>
    );
};

export default Landing;
