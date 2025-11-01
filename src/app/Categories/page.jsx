"use client";
import React from 'react';
import ctg from '../../assets/images/';
import Navbar from '../../components/Nav'
import style from './style.module.css'
import Footer from '../../components/Footer'
import Image from 'next/image';

const Home = () => {
    return (
        <>

            <Navbar />
            <div className={style.container}>
                <div className={style.ctg}> Categorias</div>

                <div className={style.ctgContainer}>
                    <div className={style.cardCtg}>
                        <a href="#">
                            <div className={style.epImg}>
                                <Image alt="imagem não encontrada" src={ctg.one} />
                            </div>
                            <div className={style.ctgItemName}> Shonen </div>
                        </a>
                    </div>
                    <div className={style.cardCtg}>
                        <a href="#">
                            <div className={style.epImg}>
                                <Image alt="imagem não encontrada" src={ctg.acao} />
                            </div>
                            <div className={style.ctgItemName}> Ação </div>
                        </a>
                    </div>
                    <div className={style.cardCtg}>
                        <a href="#">
                            <div className={style.epImg}>
                                <Image alt="imagem não encontrada" src={ctg.aventura} />
                            </div>
                            <div className={style.ctgItemName}> Aventura </div>
                        </a>
                    </div>

                    <div className={style.cardCtg}>
                        <a href="#">
                            <div className={style.epImg}>
                                <Image alt="imagem não encontrada" src={ctg.comedia} />
                            </div>
                            <div className={style.ctgItemName}> Comédia </div>
                        </a>
                    </div>
                    <div className={style.cardCtg}>
                        <a href="#">
                            <div className={style.epImg}>
                                <Image alt="imagem não encontrada" src={ctg.magia} />
                            </div>
                            <div className={style.ctgItemName}> Magia </div>
                        </a>
                    </div>
                    <div className={style.cardCtg}>
                        <a href="#">
                            <div className={style.epImg}>
                                <Image alt="imagem não encontrada" src={ctg.seinen} />
                            </div>
                            <div className={style.ctgItemName}> Seinen </div>
                        </a>
                    </div>
                    <div className={style.cardCtg}>
                        <a href="#">
                            <div className={style.epImg}>
                                <Image alt="imagem não encontrada" src={ctg.romance} />
                            </div>
                            <div className={style.ctgItemName}> Romance </div>
                        </a>
                    </div>


                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home;
