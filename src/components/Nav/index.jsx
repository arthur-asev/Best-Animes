"use client"
import React, { useState } from 'react'
import Logo from '../../assets/images/Logo.png';
import Carousel from '../Carrousel/carousel'
import Link from 'next/link';
import style from './nav.module.css'
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
   
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    function showCarousel() {

    let carousel = document.getElementById("carousel");
    if (carousel.style.display === "block") {

        carousel.style.display = "none"

    } else {
        return carousel.style.display = "block";

    };
};


    return (
        <header>
            <div className={style.nav_bar}>
                <div className={style.logo}>
                    <Link href="/" >
                        <Image src={Logo} alt="Logo" priority />
                    </Link>
                </div>

                <button className={style.hamburger} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </button>
                <ul className={`${style.nav_style} ${isMenuOpen ? style.mobileMenuOpen : ''}`}>
                    <li><Link href="/" >Início</Link></li>
                      <li><button className={style.btnz} onClick={showCarousel}>Lançamentos</button></li>
                    <li><Link href="/genres" >Categorias</Link></li>
                    <li className={style.rightIcon}>
                        <Link href="/Login" >
                            <FontAwesomeIcon icon={faUser} /> Login
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <Carousel />
            </div>
        </header>
    );
}

export default Nav;

