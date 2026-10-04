import React from 'react'
import styles from './style.module.css'

function Footer() {
    return (
        <footer>
            <div>
                <p className={styles.copyright}>Todos os direitos reservados - aos criadores</p>
            </div>
            <div>
                <ul>
                    <li>Home</li>
                    <li>Animes</li>
                    <li>Politicas de privacidade</li>
                    <li>Termos de uso</li>
                    <li>Contato</li>
                </ul>
            </div>

        </footer>
    )
} export default Footer