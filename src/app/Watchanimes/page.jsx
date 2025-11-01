"use client";
import Navbar from '../../components/Nav'
import ReactPlayer from 'react-player'
import Footer from '../../components/Footer'

const watchAnimes = () => {
    return (
        <>
            <Navbar />
            <h1>teste</h1>
            <ReactPlayer url='https://www.youtube.com/watch?v=_XrM4Y1wR88' />
            <Footer />
        </>
    )


}

export default watchAnimes
