import React from 'react';
import Logo from '../../assets/images/Logo.png';
import { Link } from 'next/link';
import Footer from '../../components/Footer';
import style from './style.module.css';


const Login = () => {
    return (
            <div>
                <nav className={style.navbar}>
                    <Link href="/">
                        <img className={style.logo} src={Logo} width="120px" height="65px" alt="Logo" />
                    </Link>
                </nav>
                <div className={style.container}>
                    <div className={`${style.content} ${style['first-content']}`}> {/* Múltiplas classes com hífen */}
                        <div className={style['first-column']}> {/* Classe com hífen */}
                            <h2 className={`${style.title} ${style['title-primary']}`}>Não possui uma conta?</h2> {/* Múltiplas classes com hífen */}
                            <p className={`${style.description} ${style['description-primary']}`}>cadastre-se agora!</p> {/* Múltiplas classes com hífen */}
                            <Link href="/register">
                                <button className={`${style.btn} ${style['btn-primary']}`}>cadastro</button> {/* Múltiplas classes com hífen */}
                            </Link>
                        </div>
                        <div className={style['second-column']}> {/* Classe com hífen */}
                            <h2 className={`${style.title} ${style['title-second']}`}>Fazer Login</h2> {/* Múltiplas classes com hífen */}
                            <div className={style['social-media']}> {/* Classe com hífen */}
                                <ul className={style['list-social-media']}> {/* Classe com hífen */}
                                    <a className={style['link-social-media']} href="#"> {/* Classe com hífen */}
                                        <li className={style['item-social-media']}> {/* Classe com hífen */}
                                            <i className={style.fab + ' fa-facebook-f'}></i> {/* Classe de CSS Module + Classe Global */}
                                        </li>
                                    </a>
                                    <a className={style['link-social-media']} href="#">
                                        <li className={style['item-social-media']}>
                                            <i className={style.fab + ' fa-google-plus-g'}></i>
                                        </li>
                                    </a>
                                    <a className={style['link-social-media']} href="#">
                                        <li className={style['item-social-media']}>
                                            <i className={style.fab + ' fa-discord'}></i>
                                        </li>
                                    </a>
                                </ul>
                            </div>
                            <p className={`${style.description} ${style['description-second']}`}>preencha os dados</p> {/* Múltiplas classes com hífen */}
                            <form className={style.form}>
                                <label className={style['label-input']}> {/* Classe com hífen */}
                                    <i className={style.fas + ' fa-user ' + style['icon-modify']}></i> {/* Múltiplas classes, incluindo global e com hífen */}
                                    <input type="text" placeholder="Nome" />
                                </label>

                                <label className={style['label-input']}>
                                    <i className={style.fas + ' fa-lock ' + style['icon-modify']}></i>
                                    <input type="password" placeholder="Senha" />
                                </label>
                                <p className={`${style.description} ${style['description-second']}`}>Esqueceu sua senha?</p>
                                <button className={`${style.btn} ${style['btn-second']}`}>Login</button> {/* Múltiplas classes com hífen */}
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            );
}



            export default Login;