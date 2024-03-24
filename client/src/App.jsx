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
        {/* creating a private route */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Route>
        
      </Routes>   
      <Footer />

    </BrowserRouter>
    
  )
}

export default App
