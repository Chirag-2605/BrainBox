    import { NavLink } from 'react-router-dom'
    import React from 'react'
    import './nav_style.css';

    const Navbar = () => {
        return (
            <>
                <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top shadow-sm" style={{display:"flex", justifyContent:"space-between"}}>
                    <div className="container-fluid">
                        <NavLink exact to="/" className="navbar-brand" style={{marginLeft:"2rem", marginRight:'3rem' ,fontSize:'1.5rem'}} activeClassName="active">
                            <i class="fa-solid fa-brain" style={{marginRight:'1rem', fontSize:'1.5rem',}}></i>BrainBox
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-nav"> 
                            <NavLink exact to="/landing" className='nav-link' activeclassname="active">Welcome</NavLink>
                                <NavLink exact to="/login" className="nav-link" activeClassName="active">Login</NavLink>
                                <NavLink exact to="/signup" className="nav-link" activeClassName="active">Signup</NavLink>
                        </div>
                        <div className="collapse navbar-collapse" id="">
                            
                        </div>
                    </div>
                </nav>
            </>
        )
    }

    export default Navbar