import React from 'react'
import Logo from '../../assets/images/Logo.png'
import Carousel from '../Carrousel/carousel'
import Link from 'next/link';
import style from './nav.module.css'
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";


function showCarousel() {

    let carousel = document.getElementById("carousel");
    if (carousel.style.display === "block") {

        carousel.style.display = "none"

    } else {
        return carousel.style.display = "block";

    };
};

function Nav() {
    return (
        <>
            <header>

                <div className={style.nav_bar}>
                    <div id="Logo"><a href="/"> <Image src={Logo} loading="eager" alt='github' /></a></div>
                    <ul className={style.nav_style}>
                        <li><Link href="/">Inicio</Link></li>
                        <li><button className={style.btnz} onClick={showCarousel}>Lançamentos</button></li>
                        <li><Link href="/Categories">Categorias</Link></li>
                        <Link href="/Login">
                            <li className={style.rightIcon}> <FontAwesomeIcon icon={faUser} />  login</li>
                        </Link>
                        <li className={style.rightIcon}> <FontAwesomeIcon icon={faSearch} /> Pesquisar</li>
                        <div className={style.clear}></div>
                    </ul>
                </div>
                <div><Carousel /></div>
            </header>
        </>
    );
}

export default Nav;

