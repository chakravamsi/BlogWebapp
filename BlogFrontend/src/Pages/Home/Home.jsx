import Banner from "../../Components/Banner/Banner";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import './Home.css';
const baseURL = import.meta.env.VITE_API_BASE;
function Home() {
    useEffect(()=>{
        fetch(`${baseURL}/blog/getAllBlogs`)
        .then(data=>{
            return data.json()
        })
        .then(data=>{
            console.log('Data from server:',data);
        })
    },[])
    return (
        <>
            <Banner />
        <div className="my-2">
                <h1>Read blogs from</h1>
                <div className="d-flex justify-content-between flex-wrap row-gap-5">
                    <Link to={'/Blogs/General'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/generall.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">General</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Education'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Education.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Education</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Technology'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Technology.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Technology</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Cooking'}>

                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/cooking.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Cooking</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Workouts'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Fitness.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Workouts</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Travel'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Travelling.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Travel</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Health'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Health.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Health</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Finance'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Finance.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Finance</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Movies'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Movie.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Movies</h5>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/Blogs/Photography'}>
                        <div className="card" style={{ width: '18rem' }}>
                            <img src="/media/Photography.jpg" className="card-img-top" alt="Programming Image" />
                            <div className="card-body">
                                <h5 className="card-title">Photography</h5>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <br />
            <br />
            <br />
        </>
    )
}
export default Home;
