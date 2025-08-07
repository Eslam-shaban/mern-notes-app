import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/auth";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Example spinner from react-spinners
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { formatDistanceToNow } from 'date-fns';
import { AiFillPlusCircle } from "react-icons/ai";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import API from '../../api/API';


const Notes = () => {

    const queryClient = useQueryClient();
    const { user } = useAuth();

    const deleteNoteMutation = useMutation({
        mutationFn: (id) =>
            API.delete(`/notes/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user}`
                    },
                }),
        onSuccess: () => {
            toast.success('Note deleted successfully');
            queryClient.invalidateQueries(['notes']);
        },
        onError: (error) => {
            console.error("Delete failed:", error);
            toast.error(error.response?.data?.message || 'Failed to delete note');
        },
    });

    // const handleDeleteNote = async (id) => {
    //     const res = await API.delete(`/notes/${id}`,
    //         {
    //             headers: {
    //                 'Authorization': `Bearer ${user}`
    //             },
    //         }
    //     )
    //     const data = await res.data;
    //     // setNotes(notes.filter((note) => note._id !== id))
    //     if (data.success) {
    //         toast.success("Note deleted successfully");
    //         queryclient.invalidateQueries(['notes']); // Invalidate the notes query to refetch data
    //     }
    // }

    const notesFetch = async () => {
        try {
            const res = await API.get("/notes", {
                headers: {
                    'Authorization': `Bearer ${user}` // Corrected header name
                }
            });
            // console.log(res)
            return res.data;
        }
        catch (err) {
            console.error("Axios fetch failed:", err.response?.data || err.message);
            const errorMessage =
                err.response?.data?.message ||
                err.response?.statusText ||
                'Failed to fetch notes';

            throw new Error(errorMessage);
        }
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['notes'],
        queryFn: notesFetch,
    })

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
    return (
        <div className=" py-8 flex flex-col gap-4 bg-sky-900 w-full h-screen">
            <Link to="/notes/create"
                className="ml-4"
            >

                <AiFillPlusCircle size={40} className="text-black hover:text-blue-500" />
            </Link>
            {data.data.length === 0 && (
                <h1 className="text-2xl pl-3 font-bold">No notes found</h1>
            )}
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">

                {data.data?.map((note) => (
                    <div
                        key={note._id}
                        className="flex flex-col gap-4 p-3 rounded-md shadow-sm shadow-gray-400"
                        style={{ backgroundColor: note.color }}>
                        <h1 className="text-2xl font-bold text-black" >{note.title}</h1>
                        <p className="text-black text-base">{note.description}</p>

                        <div className="flex justify-between">
                            <p className="text-sm text-gray-800 ">
                                {`Created: ${formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}`}
                            </p>

                            <div className="flex justify-between">
                                <Link to={`/notes/update/${note._id}`}>
                                    <CiEdit className="hover:cursor-pointer ml-1 hover:text-blue-800" size={20}>
                                    </CiEdit>
                                </Link>

                                <MdDelete onClick={() => deleteNoteMutation.mutate(note._id)}
                                    className="hover:cursor-pointer ml-1 hover:text-red-500" size={20} />

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Notes