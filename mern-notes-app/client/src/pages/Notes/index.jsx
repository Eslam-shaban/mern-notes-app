import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/auth";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Example spinner from react-spinners
import { toast } from "react-toastify";


const Notes = () => {

    const [loading, setLoading] = useState(true); // State to manage loading
    const [notes, setNotes] = useState([]);
    const { user } = useAuth();

    const handleDeleteNote = async (id) => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notes/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}` // Corrected header name
                },

            }
        )
        const data = await res.json();
        setNotes(notes.filter((note) => note._id !== id))
        if (data.success) {
            toast.success("Note deleted successfully")
        }
    }
    const getAllNotes = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/notes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}` // Corrected header name
                }
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
                setNotes(data.data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false); // Set loading to false after the fetch is complete
        }

    }

    useEffect(() => {
        getAllNotes()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    }
    return (
        <div className="container py-8 flex flex-col gap-4">
            <button >
                <Link to="/notes/create"
                    className="bg-blue-500 text-white px-4 py-2 ml-2 block rounded-md"
                > Create Note</Link></button>
            {notes.length === 0 && (
                <h1 className="text-2xl  font-bold">No notes found</h1>
            )}
            <div className=" flex flex-wrap gap-4 p-4">

                {notes.map((note) => (
                    <div
                        key={note._id}
                        className="flex flex-col gap-4 p-4  items-center justify-center w-64 h-32 rounded-md"
                        style={{ backgroundColor: note.color }}>
                        <h1 className="text-2xl font-bold text-white" >{note.title}</h1>
                        <p className="text-2xl text-gray-200">{note.description}</p>
                        <button>
                            <Link to={`/notes/update/${note._id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                Update Note
                            </Link>
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                            onClick={() => handleDeleteNote(note._id)}>
                            Delete Note
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Notes