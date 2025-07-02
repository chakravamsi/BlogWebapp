import './App.css'
import Login from './Pages/Login/Login'
import Registration from './Pages/Registration/Registration'
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import CategoryBlogs from './Pages/CategoryBlogs/CategoryBlogs';
import DedicatedBlog from './Pages/DedicatedBlog/DedicatedBlog';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Newpost from './Pages/Newpost/Newpost';
import Myposts from './Pages/Myposts/Myposts';
import { useState, useEffect } from 'react';
import PostDetails from './Pages/PostDetails/PostDetails';
import EditPost from './Pages/EditPost/EditPost';
function App() {
  let path = window.location.pathname;
  let locations = ['/Login', '/Registration']
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userID = sessionStorage.getItem("UserID");
    if (userID) {
      setUser(userID)
    }
  }, []);
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        {!locations.includes(path) && <Navbar user={user} setUser={setUser} />}
        <div className="flex-grow-1">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Login' element={<Login setUser={setUser} />} />
            <Route path='/Registration' element={<Registration />} />
            <Route path='/Newpost' element={<Newpost />} />
            <Route path='/Myposts' element={<Myposts />} />
            <Route path='/post/:id' element={<PostDetails />} />
            <Route path='/Blogs/:category' element={<CategoryBlogs />} />
            <Route path='/Blog/:id' element={<DedicatedBlog />} />
            <Route path='/edit/:id' element={<EditPost />} />
          </Routes>
        </div>
        {!locations.includes(path) && <Footer />}
      </div>
    </>
  )
}

export default App
