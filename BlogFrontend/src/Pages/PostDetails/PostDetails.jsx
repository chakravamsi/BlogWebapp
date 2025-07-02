import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const baseURL = import.meta.env.VITE_API_BASE;
function PostDetails(){
    const {id} = useParams();
    const [post,setPost] = useState(null)

    useEffect(()=>{
        fetch(`${baseURL}/blog/GetBlog/${id}`)
        .then(res=> res.json())
        .then(data =>{
            setPost(data[0]);
        })
        .catch(err => console.error("Error fetching blog:",err));
    },[id]);

    if(!post) return <p className="text-center mt-5">Loading...</p>

    return(
        <>
            
              <div className="container mt-4 d-flex flex-column align-items-center ">
                <div className="w-75 text-start">
                <h2>{post.BlogTitle}</h2>
                <p className="text-muted">{post.BlogCategory}</p>
                {post.BlogImageURL && <img src={post.BlogImageURL} alt="post" className="img-fluid my-3"/>}
                <p>{post.BlogContent}</p>
                </div>
              </div>
        </>
    )
}
export default PostDetails;