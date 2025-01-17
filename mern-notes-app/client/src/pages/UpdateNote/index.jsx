
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth"
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Example spinner from react-spinners

const UpdateNote = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();
    const [loading, setLoading] = useState(true); // State to manage loading

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("#ffffff")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const note = {
            title,
            description,
            color
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notes/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}` // Corrected header name
                },
                body: JSON.stringify(note)
            }
        )
        const data = await res.json();
        // console.log(data)
        if (data.success) {
            setTitle("")
            setDescription("")
            setColor("#ffffff")
            toast.success("Note Updated")
            navigate("/notes")
        }
    }
    const getNote = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notes/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}` // Corrected header name
                }
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
                setTitle(data.data.title);
                setDescription(data.data.description);
                setColor(data.data.color);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false); // Set loading to false after the fetch is complete
        }
    }
    useEffect(() => {
        getNote();
    }, [])


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 min-h-screen justify-center items-center">

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4">

                <input type="text" name="title" placeholder="title" value={title} onChange={(e) => { setTitle(e.target.value) }} className="bg-gray-100 px-4 py-2 rounded-md" />
                <input type="text" name="description" placeholder="description" value={description} onChange={(e) => { setDescription(e.target.value) }} className="bg-gray-100 px-4 py-2 rounded-md" />
                <select name="color" value={color} onChange={(e) => { setColor(e.target.value) }} className="bg-gray-100 px-4 py-2 rounded-md">
                    <option value="#ffffff">White</option>
                    <option value="#ff0000">Red</option>
                    <option value="#00ff00">Green</option>
                    <option value="#0000ff">Blue</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Update Note
                </button>
            </form>
        </div>
    )
}

export default UpdateNote