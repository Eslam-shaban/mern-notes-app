import { useRef } from "react";
import { useAuth } from "../../contexts/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const LoginRef = useRef(null);
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(LoginRef.current);
            const data = Object.fromEntries(formData);
            await loginUser(data);
            toast.success("User logged in successfully");
            navigate("/");
        } catch (error) {
            toast.error(error.message || "Login failed");
        }
    };

    return (
        <>

            <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-900">
                <h1 className="font-bold text-4xl mb-4">Login</h1>
                <form
                    ref={LoginRef}
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}>

                    <input required type="email" placeholder="Email" name="email"
                        className="p-2 border-2 rounded outline-none focus:border-blue-400 focus:shadow" />
                    <input required type="password" placeholder="Password" name="password"
                        className="p-2 border-2 rounded outline-none focus:border-blue-400 focus:shadow" />
                    <button type="submit" className="w-full p-2 bg-blue-500 hover:bg-blue-400 text-white rounded shadow">Login</button>
                </form>
            </div >
        </>
    )
}

export default Login