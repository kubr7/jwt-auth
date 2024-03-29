import React from 'react'
import {BrowserRouter as Router, Route, Routes  } from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from './context/AuthContext'

import Homepage from './views/Homepage'
import Registerpage from './views/Registerpage'
import Loginpage from './views/Loginpage'
import Dashboard from './views/Dashboard'
import Navbar from './views/Navbar'



function App() {
  return (
    <Router>
      <AuthProvider>
        < Navbar/>
        <Routes >
          <PrivateRoute exact path="/dashboard" element={<Dashboard/>} />
          <Route  exact path="/login" element={<Loginpage/>} />
          <Route  exact path="/register" element={<Registerpage/>} />
          <Route exact path="/" element={<Homepage/>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App