
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from './components/Navbar'
import Notes from './pages/Notes'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoutes from './utils/PrivateRoutes'
import { useAuth } from './contexts/auth'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateNote from './pages/CreateNote'
import UpdateNote from './pages/UpdateNote'

function App() {



  return (
    <>
      <ToastContainer />

      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Notes />} />
          <Route path='/notes/create' element={<CreateNote />}></Route>
          <Route path='/notes/update/:id' element={<UpdateNote />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
