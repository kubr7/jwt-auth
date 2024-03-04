import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';

const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );


    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );


    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to log in. Server returned ${response.status}.`);
            }

            const data = await response.json();
            console.log(data);

            console.log("Logged In");
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            // history.push("/")
            navigate("/dashboard");

            swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error during login:", error.message);
            swal.fire({
                title: "Login Failed",
                text: "There was an error during login. Please try again.",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerUser = async (email, username, password, password2) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, username, password, password2
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to register. Server returned ${response.status}.`);
            }

            // Registration successful, now automatically log in the user
            await loginUser(email, password);

            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } catch (error) {
            console.error("Error during registration:", error.message);
            swal.fire({
                title: "Registration Failed",
                text: "There was an error during registration. Please try again.",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        // history.push("/login")
        navigate("/login")
        swal.fire({
            title: "YOu have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    }

    useEffect(() => {
        console.log('authTokens:', authTokens);
        if (authTokens && authTokens.access) {
            try {
                setUser(jwtDecode(authTokens.access));
            } catch (error) {
                console.error('Error decoding access token:', error.message);
                // Handle the error appropriately, e.g., clear tokens and redirect to login
                setAuthTokens(null);
                setUser(null);
                localStorage.removeItem("authTokens");
                navigate("/login");
            }
        }
        setLoading(false);
    }, [authTokens, navigate]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}





