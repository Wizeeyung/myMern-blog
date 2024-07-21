import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import '../components/css/search.css';
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";
import ClipLoader from "react-spinners/ClipLoader";
import { MdScreenSearchDesktop } from "react-icons/md";
import { GiCancel } from "react-icons/gi";

const Search = () => {

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'all',
  });

  console.log(sidebarData, 'sidebar')
  

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const {theme} = useSelector((state)=> state.theme);
  const navigate = useNavigate();
  const [show, setShow] = useState(false)

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      })
    }

    const fetchPosts = async () =>{
      setLoading(true)
      try{
        
        const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getpost?${searchQuery}`);

      const data = await res.json();

      if(!res.ok){
        setLoading(false);
        return;
      }
      if(res.ok){
        setPosts(data.posts);
        setLoading(false);

        if(data.posts.length === 9){
          setShowMore(true);
        }else{
          setShowMore(false);
        }
      }

      }catch(error){
        console.log(error.message)
      }
    }
    fetchPosts()
  }, [location.search]);

  console.log(posts)

  const handleChange = (e) =>{
    if(e.target.id === 'searchTerm'){
      setSidebarData({...sidebarData, searchTerm: e.target.value});
    }

    if(e.target.id === 'sort'){
      const order = e.target.value || 'desc';
      setSidebarData({...sidebarData, sort: order});
    }

    if(e.target.id === 'all'){
      const category = e.target.value || 'all';
      setSidebarData({...sidebarData, category});
    }

  };

  const handleShowSearch = () =>{
    setShow(!show)
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);

    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)

    // setSidebarData({ ...sidebarData, searchTerm: '' });

  };


  const handleShowMore = async () =>{
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res =await fetch(`/api/post/getpost?${searchQuery}`);

    if(!res.ok){
      return;
    }

    if(res.ok){
      const data = await res.json();
      setPosts([...posts , ...data.posts]);
      if(data.posts.length === 9){
        setShowMore(true);
      }else{
        setShowMore(false);
      }
    }

    console.log('hello')
    
  };
 
  return (
    <div className="search-container">
      <div className="search-pane-container">
        <MdScreenSearchDesktop className="search-pane" onClick={handleShowSearch}/>
      </div>
      {show && <form className="sidebar-form" onSubmit={handleSubmit}>
        <GiCancel className="search-cancel" onClick={handleShowSearch}/>
        <div className="sidebar-ct">
          <label>Search Term:</label>
          <input placeholder="Search..." id="searchTerm" type="text" value={sidebarData.searchTerm} onChange={handleChange}/>
        </div>

        <div className="sidebar-ct">
          <label>Sort:</label>
          <select value={sidebarData.sort} id="sort" onChange={(e)=>handleChange(e)}>
            <option value='desc'>Latest</option>
            <option value='asc'>Oldest</option>
          </select>
        </div>

        <div className="sidebar-ct">
          <label>Category:</label>
          <select value={sidebarData.category} id="all" onChange={(e)=>handleChange(e)}>
            <option value='all'>all</option>
            <option value='javascript'>javascript</option>
            <option value='reactjs'>reactjs</option>
            <option value='nextjs'>nextjs</option>
          </select>
        </div>

        <button type="submit" onSubmit={handleSubmit}>Submit</button>
      </form>}

      <div className="sidebar-ct-right">
        <h1>Post Results</h1>
        {!loading && posts.length === 0 && <p>No post found</p>}
        {loading && <div className="sidebar-load"><ClipLoader type='TailSpin' height='50' width='50' color='red'/></div>}
        <div className="home-postcard">
          {posts && posts.map((post)=> (
              <PostCard key={post._id} post={post} />
            ))}
        </div>

        {showMore && <div className="show-btn"><button onClick={handleShowMore} className={theme === 'dark' ? "show-more-btn lights" : 'show-more-btn'}>Show More</button></div>}

      </div>
    </div>
  )
}

export default Search