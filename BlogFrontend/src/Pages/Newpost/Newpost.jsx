import { useState, useEffect, useRef } from 'react';
import './Newpost.css';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
const baseURL = import.meta.env.VITE_API_BASE;

const Newpost = () => {
    const navigate = useNavigate();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [postData, setPostData] = useState({
        UserID: null,
        category: "General",
        title: "",
        content: "",
        imageURL: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef(null);


    useEffect(() => {
        const userID = sessionStorage.getItem("UserID");

        if (!userID) {
            navigate("/login", { replace: true });
        } else {
            setPostData(prev => ({ ...prev, UserID: parseInt(userID) }));
            setIsAuthChecked(true);
        }
    }, [navigate]);

    if (!isAuthChecked) return null;

    function handleInput(e) {
        const { name, value } = e.target;
        setPostData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit() {
        if (!postData.title.trim() || !postData.content.trim()) {
            alert("Please fill in both Title and Content fields.");
            return;
        }

        setIsPosting(true);
        let imageURL = "";

        if (imageFile) {
            setIsUploading(true);
            try {
                const compressedFile = await imageCompression(imageFile, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                });

                const formData = new FormData();
                formData.append("file", compressedFile);
                formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);
                formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);


                const res = await fetch("https://api.cloudinary.com/v1_1/dza2skjr0/image/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                imageURL = data.secure_url;
            } catch (err) {
                alert("Image upload failed.");
                console.error(err);
                setIsPosting(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }

        const blogPost = {
            ...postData,
            imageURL,
        };

        fetch(`${baseURL}/blog/newBlog`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(blogPost)
        })
            .then((res) => res.json())
            .then(() => {
                setPostData({
                    UserID: parseInt(sessionStorage.getItem('UserID')),
                    category: "General",
                    title: "",
                    content: "",
                    imageURL: ""
                });
                setImageFile(null);
                fileInputRef.current.value = "";
                setSuccessMessage("Blog submitted successfully!");
                setIsPosting(false);
                setTimeout(() => setSuccessMessage(""), 1500);
            })
            .catch((err) => {
                console.error("Error submitting post:", err);
            });
    }

    return (
        <div className="d-flex justify-content-center align-items-center ">
            <form className="postForm" onSubmit={(e) => e.preventDefault()}>
                <h1 className="text-center">Create a Blog</h1>

                <label className='form-label'>Category</label>
                <select className="form-select" name='category' value={postData.category} onChange={handleInput}>
                    <option>General</option>
                    <option>Education</option>
                    <option>Technology</option>
                    <option>Travel</option>
                    <option>Health</option>
                    <option>Finance</option>
                    <option>Workouts</option>
                    <option>Movies</option>
                    <option>Cooking</option>
                    <option>Photography</option>
                </select>

                <div className="mb-3">
                    <label htmlFor="Title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="Title" placeholder="Enter title" name='title' value={postData.title} onChange={handleInput} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        ref={fileInputRef}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Content" className="form-label">Content</label>
                    <textarea className="form-control" id="content" rows="10" placeholder="Write your thoughts..." name='content' value={postData.content} onChange={handleInput}></textarea>
                </div>

                {isPosting && (
                    <div className="text-center my-3">
                        <span className="spinner-border text-primary" role="status"></span>
                        <p>Posting your blog...</p>
                    </div>
                )}

                {successMessage && (
                    <div className='alert alert-success mt-3 text-center'>
                        {successMessage}
                    </div>
                )}

                <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleSubmit}
                    disabled={isPosting}
                >
                    {isPosting ? "Posting..." : "Post"}
                </button>
            </form>
        </div>
    );
};

export default Newpost;
