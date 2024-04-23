import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import Signups from './pages/Signups'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} /> 
        <Route path='/about' element={<About />} /> 
        <Route path='/projects' element={<Projects />} />
        <Route path='/sign-up' element={<Signups />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/post/:postSlug' element={<PostPage />}/>
        {/* creating a private route */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />}/>
          <Route path='/update-post/:postId' element={<UpdatePost />}/>
        </Route>
        
      </Routes>   
      <Footer />

    </BrowserRouter>
    
  )
}

export default App
