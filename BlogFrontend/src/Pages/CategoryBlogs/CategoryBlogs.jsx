import './CategoryBlogs.css';
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_BASE;

function getCoverImageForCategory(category) {
    return `/media/${category}Cover.jpg`;
}

function CategoryBlogs() {
    const [blogs, setBlogs] = useState([]);
    const isAdmin = sessionStorage.getItem("UserRole") === "admin";
    const { category } = useParams();

    useEffect(() => {
        if (category) {
            fetch(`${baseURL}/blog/category/${category}`)
                .then(res => res.json())
                .then(data => {
                    setBlogs(data); 
                })
                .catch(err => console.error(err));
        }
    }, [category]);

    function handleDelete(blogID) {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        fetch(`${baseURL}/blog/delete/${blogID}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => {
                alert("Blog deleted");
                setBlogs(prev => prev.filter(blog => blog.ID !== blogID));
            })
            .catch(err => {
                console.error("Error deleting:", err);
            });
    }

    return (
        <>
            <div
                className="category-banner"
                style={{
                    backgroundImage: `url(${getCoverImageForCategory(category)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                }}
            >
                {category} Blogs
            </div>

            <div className="category-blogs d-flex flex-wrap gap-4 mt-4 justify-content-between m-4">
                {blogs.map((blog, index) => (
                    <div className="card" key={index} style={{ width: '18rem' }}>
                        <img
                            src={blog.BlogImageURL}
                            alt={blog.BlogTitle}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/media/default.jpg';
                            }}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{blog.BlogTitle}</h5>
                            <p className="card-text text-muted">{blog.BlogCategory}</p>
                            <p className="card-text">{blog.BlogPreviewContent}</p>
                            {isAdmin ? (
                                <div className="d-flex justify-content-between mt-2">
                                    <Link to={`/Blog/${blog.ID}`} className="btn btn-primary btn-sm">Read More</Link>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(blog.ID)}>Delete</button>
                                </div>
                            ) : (
                                <Link to={`/Blog/${blog.ID}`} className="btn btn-primary w-100 mt-2">Read More</Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default CategoryBlogs;
