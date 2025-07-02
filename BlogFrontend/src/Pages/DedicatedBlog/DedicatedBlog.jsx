import './DedicatedBlog.css';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const baseURL = import.meta.env.VITE_API_BASE;

function DedicatedBlog() {
    const { id } = useParams(); 
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        fetch(`${baseURL}/blog/GetBlog/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const dbBlog = {
                        id: data[0].ID,
                        title: data[0].BlogTitle,
                        category: data[0].BlogCategory,
                        content: data[0].BlogContent,
                        imageURL: data[0].BlogImageURL,
                    };
                    setBlog(dbBlog);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching blog:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading blog...</p>;
    if (!blog) return <p>Blog not found</p>;

    return (
        <>

            <div className="container d-flex flex-column align-items-center mt-4">
                <div className="w-75 text-start">
                    <h1>{blog.title}</h1>
                    <p className="text-muted">{blog.category}</p>

                    {blog.imageURL && (
                        <img
                            src={blog.imageURL}
                            className="img-fluid mb-3"
                            alt={blog.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/media/default.jpg";
                            }}
                        />
                    )}

                    <p>{blog.content}</p>
                </div>
            </div>

        </>
    );
}

export default DedicatedBlog;
