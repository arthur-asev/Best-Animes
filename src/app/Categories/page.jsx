import React from 'react';
import ctg from  '../../assets/images/';
import Navbar from '../../components/Nav'
import style from'./style.module.css'
import Footer from '../../components/Footer'

const Home = () => {
    return (
        <>
        
            {/* <Navbar/> */}
            <div className={style.ctg}> Categorias</div>
            
            <div className={style.ctgContainer}>
                <div className={style.cardCtg}>
                    <a href="#">
                        <div className={style.epImg}>
                        <img src={ctg.one}/>
                        </div>
                        <div className={style.ctgItemName}> Shonen </div>
                    </a>
                </div>
                <div className={style.cardCtg}>
                    <a href="#">
                        <div className={style.epImg}>
                        <img src={ctg.acao}/>
                        </div>
                        <div className={style.ctgItemName}> Ação </div>
                    </a>
                </div>
                <div className={style.cardCtg}>
                    <a href="#">
                        <div className={style.epImg}>
                        <img src={ctg.aventura}/>
                        </div>
                        <div className={style.ctgItemName}> Aventura </div>
                    </a>
                </div>

                <div className={style.cardCtg}>
                    <a href="#">
                        <div className={style.epImg}>
                        <img src={ctg.comedia}/>
                        </div>
                        <div className={style.ctgItemName}> Comédia </div>
                    </a>
                </div>
                <div className={style.cardCtg}>
                    <a href="#">
                        <div className={style.epImg}>
                        <img src={ctg.magia}/>
                        </div>
                        <div className={style.ctgItemName}> Magia </div>
                    </a>
                </div>
                <div className={style.cardCtg}>
                    <a href="#">
                        <div className={style.epImg}>
                        <img src={ctg.seinen}/>
                        </div>
                        <div className={style.ctgItemName}> Seinen </div>
                    </a>
                </div>
                <div className={style.cardCtg}>
                    <a href="#">
                        <div className={style.epImg}>
                        <img src={ctg.romance}/>
                        </div>
                        <div className={style.ctgItemName}> Romance </div>
                    </a>
                </div>
                
             
            </div>
            <Footer/>
        </>
    );
}

export default Home;
