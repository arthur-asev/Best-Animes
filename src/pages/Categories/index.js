import React from 'react';
import ctg from  '../../assets/images/index'
import Navbar from '../Nav'
import './style.css'
import Footer from '../Footer'

function Home() {
    return (
        <>
            <Navbar/>
            <div className="ctg"> Categorias</div>
            
            <div className="ctgContainer">
                <div className="cardCtg">
                    <a href="#">
                        <div className="epImg">
                        <img src={ctg.one}/>
                        </div>
                        <div className="ctgItemName"> Shonen </div>
                    </a>
                </div>
                <div className="cardCtg">
                    <a href="#">
                        <div className="epImg">
                        <img src={ctg.acao}/>
                        </div>
                        <div className="ctgItemName"> Ação </div>
                    </a>
                </div>
                <div className="cardCtg">
                    <a href="#">
                        <div className="epImg">
                        <img src={ctg.aventura}/>
                        </div>
                        <div className="ctgItemName"> Aventura </div>
                    </a>
                </div>

                <div className="cardCtg">
                    <a href="#">
                        <div className="epImg">
                        <img src={ctg.comedia}/>
                        </div>
                        <div className="ctgItemName"> Comédia </div>
                    </a>
                </div>
                <div className="cardCtg">
                    <a href="#">
                        <div className="epImg">
                        <img src={ctg.magia}/>
                        </div>
                        <div className="ctgItemName"> Magia </div>
                    </a>
                </div>
                <div className="cardCtg">
                    <a href="#">
                        <div className="epImg">
                        <img src={ctg.seinen}/>
                        </div>
                        <div className="ctgItemName"> Seinen </div>
                    </a>
                </div>
                <div className="cardCtg">
                    <a href="#">
                        <div className="epImg">
                        <img src={ctg.romance}/>
                        </div>
                        <div className="ctgItemName"> Romance </div>
                    </a>
                </div>
                
             
            </div>
            <Footer/>
        </>
    );
}

export default Home;
