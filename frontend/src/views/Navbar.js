import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img style={{ width: "120px", padding: "6px" }} src="https://i.imgur.com/juL1aAc.png" alt="" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">Home</Link>
                            </li>
                            {!user && // If user is not logged in, show Login and Register links
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                </>
                            }
                            {user && // If user is logged in, show Dashboard and Logout links
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="nav-item">
                                        <span className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</span>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
