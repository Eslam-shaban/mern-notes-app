import { useState } from "react"
import { useAuth } from "../../contexts/auth"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from '../../api/API';
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateNote = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("#ffffff")
    const queryClient = useQueryClient();

    const createNoteMutation = useMutation({
        mutationFn: (note) =>
            API.post(`/notes`, note,
                {
                    headers: {
                        'Authorization': `Bearer ${user}`
                    },
                    body: JSON.stringify(note)
                }),
        onSuccess: () => {
            setTitle("")
            setDescription("")
            setColor("#ffffff")
            toast.success('Note Created');
            queryClient.invalidateQueries(['notes']);
            navigate("/")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create note');
            console.error(error.response?.data?.message || 'Failed to create note');
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const note = { title, description, color }
        createNoteMutation.mutate(note);
    }

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
                    disabled={createNoteMutation.isPending}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    {createNoteMutation.isPending ? "Creating..." : "Create Note"}
                </button>
            </form>
        </div>
    )
}

export default CreateNote