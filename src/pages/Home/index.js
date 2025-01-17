import React from 'react';
import epiImg from '../../assets/images/Shingeki.jpg'
import ep1 from  '../../assets/images/index'
import Nav from '../Nav/indexhome'
import Footer from '../Footer'
import './style.css'


   
function Home() {
    return (
        <>
            <Nav/>
            <div className="lastEps"> Últimos episódios Lançados</div>
            <div className='container flex-start'>

            <div className="epContainer">
            

                <div className="cardEp">
                    <a href="#">
                        <div className="epLeg"><h4>Legendado</h4></div>
                        <div className="epImg">
                            <img src={epiImg}/>
                        </div>
                        <div className="epItemsInfos">
                            <div className="epItemName">Shingeki no Kyojin- Episódio 16 HD
                                <i className="fas fa-play icon-play"></i>
                            </div>
                        </div>
                    </a>
                </div>
                
                <div className="cardEp">
                    <a href="#">
                        <div className="epLeg"><h4>Legendado</h4></div>
                        <div className="epImg">
                            <img src={ep1.yuru}/>
                        </div>
                        <div className="epItemsInfos">
                            <div className="epItemName"> Yuru-Camp-2-Episódio-13
                                <i className="fas fa-play icon-play"></i>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="cardEp">
                    <a href="#">
                        <div className="epLeg"><h4>Legendado</h4></div>
                        <div className="epImg">
                            <img src={ep1.one}/>
                        </div>
                        <div className="epItemsInfos">
                            <div className="epItemName">  One-Piece-Episódio-967
                                <i className="fas fa-play icon-play"></i>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="cardEp">
                    <a href="#">
                        <div className="epLeg"><h4>Legendado</h4></div>
                        <div className="epImg">
                            <img src={epiImg}/>
                        </div>
                        <div className="epItemsInfos">
                            <div className="epItemName">Shingeki no Kyojin- Episódio 16 HD
                                <i className="fas fa-play icon-play"></i>
                            </div>
                        </div>
                    </a>
                </div>
                
                <div className="cardEp">
                    <a href="#">
                        <div className="epLeg"><h4>Legendado</h4></div>
                        <div className="epImg">
                            <img src={ep1.yuru}/>
                        </div>
                        <div className="epItemsInfos">
                            <div className="epItemName"> Yuru-Camp-2-Episódio-13
                                <i className="fas fa-play icon-play"></i>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="cardEp">
                    <a href="#">
                        <div className="epLeg"><h4>Legendado</h4></div>
                        <div className="epImg">
                            <img src={ep1.one}/>
                        </div>
                        <div className="epItemsInfos">
                            <div className="epItemName">  One-Piece-Episódio-967
                                <i className="fas fa-play icon-play"></i>
                            </div>
                        </div>
                    </a>
                </div>

             
               


               
            </div>
            </div>
            <Footer/>
            
        </>
    );
}

export default Home;
