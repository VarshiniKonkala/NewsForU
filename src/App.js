import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; 
import './App.css'; 
import AuthPage from './AuthPage.js'; 
 
const App = () => { 
  const [categorizedNews, setCategorizedNews] = useState({}); 
  const [loggedInUser, setLoggedInUser] = useState(null); 
  const [recentlyViewedArticles, setRecentlyViewedArticles] = useState([]); 
  const [selectedCategory,setSelectedCategory]=useState('');
  const [recommendedArticles,setRecommendedArticles]=useState([]);
  useEffect(() => { 
    const fetchNews = async () => { 
      try { 
        const response = await axios.get(`https://backend-zbir.onrender.com/news`, { 
          params: { country: 'in' }, 
        }); 
        const newsData = response.data.map(article => ({ 
          _id: article.title,  
          title: article.title, 
          description: article.description, 
          url: article.url, 
          imageUrl: article.urlToImage, 
          category: article.category || 'Uncategorized', 
        })); 
        const categorizationResponse = await axios.post('https://flask-9234.onrender.com/categorize_news', { 
          newsData: newsData, 
        }); 
        setCategorizedNews(categorizationResponse.data); 
      } catch (error) { 
        console.error('Error fetching or categorizing news:', error); 
      } 
    }; 
 
    fetchNews(); 
    const fun=async()=>{ 
      const userString = localStorage.getItem('loggedInUser'); 
      if (userString) { 
        try { 
          const user = JSON.parse(userString); 
          if (user) { 
            setLoggedInUser(user); 
            //console.log(user); 
            const response=await axios.get('https://backend-zbir.onrender.com/recentlyViewedArticles/'+user.username); 
            console.log(response); 
            setRecentlyViewedArticles(response.data.recentlyViewedArticles); 
            console.log(recentlyViewedArticles); 
          } 
        } catch (error) { 
          console.error('Error parsing user data:', error); 
        } 
      } 
    } 
    fun();
  },[]); 
  const countries = [ 
    { code: 'in', name: 'India' }, 
    { code: 'ae', name: 'United Arab Emirates' }, 
    { code: 'ar', name: 'Argentina' }, 
    { code: 'at', name: 'Austria' }, 
    { code: 'au', name: 'Australia' }, 
    { code: 'be', name: 'Belgium' }, 
    { code: 'bg', name: 'Bulgaria' }, 
    { code: 'br', name: 'Brazil' }, 
    { code: 'ca', name: 'Canada' }, 
    { code: 'ch', name: 'Switzerland' }, 
    { code: 'cn', name: 'China' }, 
    { code: 'co', name: 'Colombia' }, 
    { code: 'cu', name: 'Cuba' }, 
    { code: 'cz', name: 'Czech Republic' }, 
    { code: 'de', name: 'Germany' }, 
    { code: 'eg', name: 'Egypt' }, 
    { code: 'fr', name: 'France' }, 
    { code: 'gb', name: 'United Kingdom' }, 
    { code: 'gr', name: 'Greece' }, 
    { code: 'hk', name: 'Hong Kong' }, 
    { code: 'hu', name: 'Hungary' }, 
    { code: 'id', name: 'Indonesia' }, 
    { code: 'ie', name: 'Ireland' }, 
    { code: 'il', name: 'Israel' }, 
    { code: 'it', name: 'Italy' }, 
    { code: 'jp', name: 'Japan' }, 
    { code: 'kr', name: 'South Korea' }, 
    { code: 'lt', name: 'Lithuania' }, 
    { code: 'lv', name: 'Latvia' }, 
    { code: 'ma', name: 'Morocco' }, 
    { code: 'mx', name: 'Mexico' }, 
    { code: 'my', name: 'Malaysia' }, 
    { code: 'ng', name: 'Nigeria' }, 
    { code: 'nl', name: 'Netherlands' }, 
    { code: 'no', name: 'Norway' }, 
    { code: 'nz', name: 'New Zealand' }, 
    { code: 'ph', name: 'Philippines' }, 
    { code: 'pl', name: 'Poland' }, 
    { code: 'pt', name: 'Portugal' }, 
    { code: 'ro', name: 'Romania' }, 
    { code: 'rs', name: 'Serbia' }, 
    { code: 'ru', name: 'Russia' }, 
    { code: 'sa', name: 'Saudi Arabia' }, 
    { code: 'se', name: 'Sweden' }, 
    { code: 'sg', name: 'Singapore' }, 
    { code: 'si', name: 'Slovenia' }, 
    { code: 'sk', name: 'Slovakia' }, 
    { code: 'th', name: 'Thailand' }, 
    { code: 'tr', name: 'Turkey' }, 
    { code: 'tw', name: 'Taiwan' }, 
    { code: 'ua', name: 'Ukraine' }, 
    { code: 'us', name: 'United States' }, 
    { code: 've', name: 'Venezuela' }, 
    { code: 'za', name: 'South Africa' }, 
  ]; 
 
  const handleCountryChange = (event) => { 
    const c=event.target.value; 
    console.log(c); 
    const fetchNews = async () => { 
      try { 
        const response = await axios.get(`https://backend-zbir.onrender.com/news`, { 
          params: { country: c }, 
        }); 
        const newsData = response.data.map(article => ({ 
          _id: article.title,  
          title: article.title, 
          description: article.description, 
          url: article.url, 
          imageUrl: article.urlToImage, 
          category: article.category || 'Uncategorized', 
        })); 
        const categorizationResponse = await axios.post('https://flask-9234.onrender.com/categorize_news', { 
          newsData: newsData, 
        }); 
        setCategorizedNews(categorizationResponse.data); 
      } catch (error) { 
        console.error('Error fetching or categorizing news:', error); 
      } 
    }; 
 
    fetchNews(); 
  }; 
 
  const handleLogin = (user) => { 
    setLoggedInUser(user); 
    localStorage.setItem('loggedInUser', JSON.stringify(user)); 
  }; 
 
  const handleLogout = () => { 
    setLoggedInUser(null); 
    localStorage.removeItem('loggedInUser'); 
  }; 
  const fetchRecommendedNews=async()=>{
    try{
    const response=await axios.post('https://flask-9234.onrender.com/recommended_news',{
      categorizedNews:categorizedNews,
      recentlyViewedArticles:recentlyViewedArticles
    });
    setRecommendedArticles(response.data);
  }catch(err){
    console.log(err);
  }
  }
  return ( 
    <Router> 
      <div> 
        <header> 
          <div className="logo"> 
            <Link to="/NewsForU" style={{fontFamily:'papyrus'}}>NewsForU</Link> 
          </div> 
          <nav> 
            <ul> 
              {
                (loggedInUser)&&<li key="foru"><Link to ='/ForU' onClick={()=>{fetchRecommendedNews();setSelectedCategory('ForU')}}>
                  <button style={{ borderBottom: `${selectedCategory==='ForU' ? "2px solid white" : "0px"}`, backgroundColor:'#333', border:"none",color:"white"}}>
                    ForU</button>
                  </Link></li>
              }
              {Object.keys(categorizedNews).map(category => ( 
                <li key={category}> 
                  <Link to={`/${category.toLowerCase()}`} onClick={()=>{if(selectedCategory!==category){setSelectedCategory(category)}}}> 
                   <button style={{ borderBottom: `${selectedCategory===category ? "2px solid white" : "0px"}`, backgroundColor:'#333', border:"none",color:"white"}}>
                    {category}</button>
                  </Link> 
                </li> 
              ))} 
            </ul> 
          </nav> 
          <div className="country-selector"> 
            <label htmlFor="country-select">Select Country:</label> 
            <select id="country-select" onChange={handleCountryChange}> 
              {countries.map(country => ( 
                <option key={country.code} value={country.code}>{country.name}</option> 
              ))} 
            </select> 
          </div> 
          <div id="login"> 
            {loggedInUser ? ( 
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>{loggedInUser.username}</Link> 
            ) : ( 
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Login/Signup</Link> 
            )} 
          </div> 
        </header> 
        <div style={{ paddingTop: '70px' }}> 
          <Routes> 
            {Object.keys(categorizedNews).map(category => ( 
              <Route 
                key={category} 
                path={`/${category.toLowerCase()}`} 
                element={<CategoryPage loggedInUser={loggedInUser} news={categorizedNews[category]} setRecentlyViewedArticles={setRecentlyViewedArticles} recentlyViewedArticles={recentlyViewedArticles}/>} 
              /> 
            ))} 
            <Route 
              key="business" 
              path="/NewsForU" 
              element={<CategoryPage loggedInUser={loggedInUser} news={categorizedNews['BUSINESS']} setRecentlyViewedArticles={setRecentlyViewedArticles} recentlyViewedArticles={recentlyViewedArticles}/>} 
            /> 
            <Route 
              key="foru" 
              path="/ForU" 
              element={<CategoryPage loggedInUser={loggedInUser} news={recommendedArticles} setRecentlyViewedArticles={setRecentlyViewedArticles} recentlyViewedArticles={recentlyViewedArticles}/>} 
            /> 
            <Route path="/login" element={<AuthPage handleLogin={handleLogin} />} /> 
            <Route path="/profile" element={<ProfilePage recentlyViewedArticles={recentlyViewedArticles} user={loggedInUser} handleLogout={handleLogout}/>} /> 
          </Routes> 
        </div> 
      </div> 
    </Router> 
  ); 
}; 
 
const CategoryPage = ({ loggedInUser, news, setRecentlyViewedArticles,recentlyViewedArticles}) => { 
  const handleArticleView = async (article) => { 
    if (loggedInUser) { 
      try { 
        await axios.post(`https://backend-zbir.onrender.com/addRecentlyViewed`, { 
          userId: loggedInUser._id, 
          article: article 
        }); 
      } catch (error) { 
        console.error('Error adding recently viewed article:', error); 
      } 
    } 
  }; 
  if(!news) 
  return(<div><p>No Articles to display!! Please Browse!!</p></div>); 
  return ( 
    <div className="news-container"> 
      <ul style={{ listStyleType: 'none' }}> 
        {news.map(article => ( 
          <li key={article.title}> 
            <strong>{article.title}</strong> 
            <hr style={{border:'1px solid white' }}/> 
            {article.imageUrl && <img src={article.imageUrl} alt="News Thumbnail" />} 
            <p>{article.description}</p> 
            <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={() =>{handleArticleView(article);setRecentlyViewedArticles([article,...recentlyViewedArticles]);}}><button id="b">Read more</button></a> 
            <hr />           
          </li> 
        ))} 
      </ul> 
    </div> 
  ); 
}; 
 
const ProfilePage = ({recentlyViewedArticles, user, handleLogout}) => { 
  if (!user) { 
    return <Navigate to="/login" />; 
  } 
  if(!recentlyViewedArticles) 
  return( 
    <div> 
      <h2>Welcome, {user.username}!</h2> 
      <button onClick={handleLogout}>Logout</button> 
    </div> 
  ); 
  return ( 
    <div> 
      <button id="logout" onClick={handleLogout}>Logout</button> 
      <div className='news-container'> 
        <h3 style={{fontFamily:"cursive",fontSize:"45px"}}>Recently Viewed Articles:</h3> 
        <ul style={{ listStyleType: 'none' }}> 
          {recentlyViewedArticles.map(article => ( 
            <li key={article._id.toString()}> 
              <strong>{article.title}</strong> 
              <hr style={{border:'1px solid white' }}/> 
              {article.imageUrl && <img src={article.imageUrl} alt="News Thumbnail" />} 
              <p>{article.description}</p> 
              <a href={article.url} target="_blank" rel="noopener noreferrer"><button id="b">Read more</button></a> 
              <hr /> 
            </li> 
          ))} 
        </ul> 
      </div> 
    </div> 
  ); 
};
export default App; 
