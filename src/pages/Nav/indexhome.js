import React from 'react'
import Logo from '../../assets/images/Logo.png'
import Carousel from './carousel'
import {Link} from 'react-router-dom'
import './style.css'



function showCarousel(){ 
    
    let carousel = document.getElementById("carousel");
    if ( carousel.style.display === "block") {
        
        carousel.style.display = "none"
        
    } else {    
        return carousel.style.display = "block";

    };
};

function Nav() {
    return (
        <>
            <header>
                <div className="nav-bar">
                    <div id="Logo"><a href="/"><img src={Logo} alt="logo" /></a></div>
                    <ul className="nav-style">
                        <li><button className="btnz" onClick={showCarousel}>Lançamentos</button></li>
                        <li><Link to="/categories">Categorias</Link></li>
                        <Link to="/login">
                            <li className="rightIcon"><i className="fas fa-user icon-modify"></i></li>
                        </Link>
    
                        <label><li className="rightIcon"><i className="fas fa-search"></i></li></label>
                        <input className="rightIcon search-bar" type="text" placeholder=" Pesquisar" />

                        <div className="clear"></div>
                    </ul>
                </div>
                <div><Carousel/></div>
            </header>
        </>
    );
}

export default Nav;

