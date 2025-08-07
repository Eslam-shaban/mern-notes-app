import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { CgNotes } from "react-icons/cg";

const Navbar = () => {
    const { user, logoutUser } = useAuth();

    return (
        <>

            <nav className='bg-white text-black flex justify-between items-center p-4'>
                <Link className='flex items-center gap-1' to='/'>
                    <CgNotes size={25} />
                    <p className='font-bold h2-bold'>Notes</p>
                </Link>
                {user ? (
                    <>
                        <div>
                            <input type="text" className='w-48 border-2 border-blue-500 rounded-md' />
                        </div>
                        <button className='bg-red-600 p-2 rounded text-white' onClick={logoutUser}>Logout</button>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link className='bg-green-600 p-2 rounded text-white' to='/login'>Login</Link>
                        <Link className='bg-blue-600 p-2 rounded text-white' to='/register'>Register</Link>
                    </div>
                )}
            </nav>

            {/* <nav className='bg-white text-black flex justify-between items-center p-4'>
                    <div className="flex-1 flex justify-center">
                        <Link className='font-bold text-xl text-teal-800' to='/'>Home</Link>
                    </div>
                  
                </nav> */}

        </>
    )
}

export default Navbar
