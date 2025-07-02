import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const baseURL = import.meta.env.VITE_API_BASE;

function Myposts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const userID = sessionStorage.getItem("UserID");
        if (!userID) {
            alert("Please login to view your posts");
            return;
        }

        fetch(`${baseURL}/blog/getUserBlogs/${userID}`)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Error fetching posts:", err));
    }, []);

    function handleDelete(blogID) {
        const confirmDelete = window.confirm("Are you sure you want to delete this Blog?");
        if (!confirmDelete) return;

        fetch(`${baseURL}/blog/delete/${blogID}`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                setPosts(prevPosts => prevPosts.filter(post => post.ID !== blogID));
            })
            .catch(err => {
                console.error("Failed to delete blog:", err);
                alert("Something went wrong while deleting the blog.");
            });
    }

    function handleAddToHome(postId) {
        fetch(`${baseURL}/blog/feature/${postId}`, {
            method: 'PATCH'
        })
            .then(res => res.json())
            .then(data => {
                alert("Blog added to home successfully");
                setPosts(prev =>
                    prev.map(p => p.ID === postId ? { ...p, isFeatured: 1 } : p)
                );
            })
            .catch(err => {
                console.error("Error adding Blog to home:", err);
            });
    }

    return (
    <div className="container py-4">
        <h2 className="mb-4 text-center text-primary">My Blogs</h2> 

        <div className="d-flex flex-wrap gap-4 justify-content-between">
            {posts.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh', width: '100%' }}>
                    <p className="fw-bold fs-4 text-muted">No Blogs found</p>
                </div>
            ) : (
                posts.map(post => (
                    <div key={post.ID} className="card" style={{ width: '18rem' }}>
                        {post.BlogImageURL && (
                            <img src={post.BlogImageURL} className="card-img-top" alt="Post" />
                        )}
                        <div className="card-body">
                            <h5 className="card-title">{post.BlogTitle}</h5>
                            <p>{post.BlogCategory}</p>
                            <p className="card-text">{post.BlogPreviewContent}</p>
                            <div className='text-end'>
                                <Link to={`/post/${post.ID}`} className="btn btn-outline-primary btn-sm w-100">Read More</Link>
                            </div>

                            <div className="mt-3 d-flex flex-wrap gap-2 justify-content-between">
                                <Link to={`/edit/${post.ID}`} className='btn btn-outline-warning btn-sm'>Edit</Link>
                                <button className='btn btn-outline-danger btn-sm' onClick={() => handleDelete(post.ID)}>Delete</button>
                                {post.isFeatured ? (
                                    <button className="btn btn-success btn-sm" disabled>Published</button>
                                ) : (
                                    <button onClick={() => handleAddToHome(post.ID)} className="btn btn-outline-success btn-sm">Publish to Home</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

}

export default Myposts;
