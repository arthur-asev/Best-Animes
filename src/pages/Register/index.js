import React from 'react';
import Logo from '../../assets/images/Logo.png'
import {Link} from 'react-router'
import Footer from '../Footer'


import './style.css';

const Register = () =>{
    return (
        <div>
            <nav className="navbar">
                <Link to="/">
                    <img  className="logo" src={Logo} alt='logo' width="120px" height="65px"/>
                </Link>
            </nav>
            <div className="container">
                <div className="content first-content">
                    <div className="first-column">
                        <h2 className="title title-primary">Já sou cadastrado</h2>
                        <p className="description description-primary">matenha-se conectado</p>
                        <p className="description description-primary">faça o login com suas informações pessoais</p>
                        <Link to="/login">
                            <button className="btn btn-primary">entrar</button>
                        </Link>
                    </div>
                    <div className="second-column">
                        <h2 className="title title-second">Criar sua Conta
                        </h2>
                        <div className="social-media">
                            <ul className="list-social-media">
                                    <a className="link-social-media" href="#">
                                <li className="item-social-media">
                                    <i className="fab fa-facebook-f"></i>
                                </li>
                                    </a>
                                    <a className="link-social-media" href="#">
                                <li className="item-social-media">
                                    <i className="fab fa-google-plus-g"></i>
                                </li>
                                    </a>
                                    <a className="link-social-media" href="#">
                                <li className="item-social-media">
                                    <i className="fab fa-discord"></i>
                                </li>
                                    </a>
                            </ul>
                        </div>
                        <p className="description description-second">preencha os dados</p>
                        <form className="form">
                            <label className="label-input">
                                <i className="fas fa-user icon-modify"></i>
                                <input type="text" placeholder="Nome"/>
                            </label>

                            <label className="label-input">
                                <i className="fas fa-envelope icon-modify"></i>
                                <input type="email" placeholder="Email"/>
                            </label>

                            <label className="label-input">
                                <i className="fas fa-lock icon-modify"></i>
                                <input type="password" placeholder="Senha"/>
                            </label>

                            <button className="btn btn-second">registrar</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Register;
