import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import './EditPost.css'
const baseURL = import.meta.env.VITE_API_BASE;

const Editpost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [postData, setPostData] = useState({
        category: "",
        title: "",
        content: "",
        imageURL: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetch(`${baseURL}/blog/GetBlog/${id}`)
            .then(res => res.json())
            .then(data => {
                const blog = data[0];
                setPostData({
                    category: blog.BlogCategory,
                    title: blog.BlogTitle,
                    content: blog.BlogContent,
                    imageURL: blog.BlogImageURL
                });
            })
            .catch(err => console.error("Error loading post:", err));
    }, [id]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        let updatedImageURL = postData.imageURL;

        if (imageFile) {
            try {
                const compressedFile = await imageCompression(imageFile, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                });

                const formData = new FormData();
                formData.append("file", compressedFile);
                formData.append("upload_preset", "blog_upload");
                formData.append("cloud_name", "dza2skjr0");

                const res = await fetch("https://api.cloudinary.com/v1_1/dza2skjr0/image/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                updatedImageURL = data.secure_url;
            } catch (err) {
                alert("Image upload failed.");
                console.error(err);
                return;
            }
        }

        fetch(`${baseURL}/blog/update/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...postData, imageURL: updatedImageURL })
        })
            .then(res => res.json())
            .then(data => {
                alert("Post updated successfully");
                navigate('/Myposts');
            })
            .catch(err => console.error("Update failed:", err))
            .finally(() => setIsUpdating(false));
    };

    return (
        <div className="container mt-4 editpost">
            <h2>Edit Blog</h2>
            <label>Category</label>
            <select name="category" className="form-select" value={postData.category} onChange={handleInput}>
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

            <label>Title</label>
            <input className="form-control" name="title" value={postData.title} onChange={handleInput} />

            
            <label>Upload New Image</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setImageFile(e.target.files[0])} ref={fileInputRef} />



            <label>Content</label>
            <textarea className="form-control" rows={8} name="content" value={postData.content} onChange={handleInput} />


            <button className="btn btn-primary mt-3 w-100" onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
            </button>
        </div>
    );
};

export default Editpost;
