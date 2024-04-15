import './Sidebar.css'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    function handleLogout () {
        localStorage.removeItem("token");
    }
    return (
        <div className='sidebar'>
            <input type="checkbox" id="check"></input>
            <div className="but_one">
                <label for="check">
                    <i className="fa-solid fa-bars sidebar-logo"></i>
                </label>
            </div>
            <div className="slidebar_menu">
                <div className="sidebar-logo">
                    <i className="fa-solid fa-brain"></i>
                    <span>BrainBox</span>
                </div>
                <div className="but_two">
                    <label for="check">
                        <i className="fa-solid fa-x"></i>
                    </label>
                </div>
        
                <div className="menu">
                    <ul>
                        <li>
                            <i class="fa-solid fa-folder"></i>
                            <NavLink exact to="/documents" className="menu-item">Documents</NavLink>
                        </li>
                        <li>
                            <i class="fa-solid fa-clipboard-check"></i>
                            <NavLink exact to="/board" className="menu-item">To-Do</NavLink>
                        </li>
                        <li>
                            <i class="fa-regular fa-calendar-days"></i>
                            <NavLink exact to="/calendar" className="menu-item">Calendar</NavLink>
                        </li>
                        <li>
                            <i className="fa-solid fa-phone"></i>
                            <NavLink exact to="/contact" className="menu-item">Contact</NavLink>
                        </li>
                        <li>
                            <i className="fa-solid fa-comments"></i>
                            <NavLink exact to="/feedback" className="menu-item">Feedback</NavLink>
                        </li>
                        <li>
                            <i class="fa-solid fa-arrow-right-from-bracket"></i>
                            <NavLink exact to="/landing" className="menu-item" onClick={handleLogout}>Logout</NavLink>
                        </li>
                    </ul>
                </div>
        
                <div className="social_media">
                    <ul>
                        <span className='menu-icon'><i class="fa-brands fa-facebook"></i></span>
                        <span className='menu-icon'><i class="fa-brands fa-twitter"></i></span>
                        <span className='menu-icon'><i class="fa-brands fa-instagram"></i></span>
                        <span className='menu-icon'><i class="fa-brands fa-youtube"></i></span>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
