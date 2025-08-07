
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth"
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Example spinner from react-spinners
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from '../../api/API';

const UpdateNote = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();
    // const [isLoading, setLoading] = useState(true); // State to manage loading

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#ffffff");

    const queryClient = useQueryClient();

    // 1️⃣ Fetch single note by ID
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notes', id],
        queryFn: async () => {
            const res = await API.get(`/notes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user}`
                }
            });
            return res.data;
        },
        enabled: !!user, // prevent query from running before auth is ready
    })
    const note = data?.data;
    // 2️⃣ Populate the form when data is loaded
    useEffect(() => {
        if (note) {
            // console.log(note)
            setTitle(note.title);
            setDescription(note.description); description
            setColor(note.color);
        }
    }, [note])

    // 3️⃣ Mutation to update note
    const updateNoteMutation = useMutation({
        mutationFn: (note) =>
            API.put(`/notes/${id}`, note, {
                headers: {
                    'Authorization': `Bearer ${user}`,
                }
            }),
        onSuccess: () => {
            // setTitle("")
            // setDescription("")
            // setColor("#ffffff")
            toast.success("Note Updated");
            queryClient.invalidateQueries(['notes']);
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update note');
        }

    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const note = { title, description, color }
        // console.log(note)
        updateNoteMutation.mutate(note);
    }
    // 4️⃣ UI feedback
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
            </div>
        );
    }
    if (isError) {
        console.error("Fetching notes failed:", error);
        toast.error(error?.message || "Failed to load notes");
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg font-semibold">
                    {error.message || 'Something went wrong while fetching notes.'}
                </p>
            </div>
        );
    }

    // 5️⃣ Form UI
    return (
        <div className="flex flex-col gap-4 p-4 min-h-screen justify-center items-center  bg-sky-900">

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4">

                <input type="text" name="title" placeholder="title" value={title} onChange={(e) => { setTitle(e.target.value) }} className="bg-gray-100 px-4 py-2 rounded-md" />
                <input type="text" name="description" placeholder="description" value={description} onChange={(e) => { setDescription(e.target.value) }} className="bg-gray-100 px-4 py-2 rounded-md" />
                <select name="color" value={color} onChange={(e) => { setColor(e.target.value) }} className="bg-gray-100 px-4 py-2 rounded-md">
                    <option value="#efefef">White</option>
                    <option value="#f44336">Red</option>
                    <option value="#099660">Green</option>
                    <option value="#2196F3">Blue</option>
                    <option value="#FFC107">Yellow</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    disabled={updateNoteMutation.isPending}
                >
                    {updateNoteMutation.isPending ? "Updating..." : "Update Note"}
                </button>
            </form>
        </div>
    )
}

export default UpdateNote