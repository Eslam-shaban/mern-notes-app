import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/auth'



const Navbar = () => {

    const { user, logoutUser } = useAuth();

    return (
        <nav className='bg-blue-400 text-white flex justify-center'>

            {user ? (
                <>
                    <Link className='mx-4 py-2' to='/'>Home</Link>
                    <Link className='mx-4 py-2' to='/notes'>Notes</Link>
                    <button className='mx-4 py-2' onClick={logoutUser}>Logout</button>
                </>)
                :
                (
                    <>
                        <Link className='mx-4 py-2' to='/'>Home</Link>
                        <Link className='mx-4 py-2' to='/login'>Login</Link>
                        <Link className='mx-4 py-2' to='/register'>Register</Link>
                    </>
                )
            }
        </nav>

    )
}

export default Navbar