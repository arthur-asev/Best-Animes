import React from 'react'
import Navbar from '../Nav/index'
import ReactPlayer from 'react-player'

const watchAnimes = () =>{
    return(
        <>
        <Navbar/>
        <ReactPlayer url='https://www.youtube.com/watch?v=_XrM4Y1wR88' />

        </>
    )


}

    export default watchAnimes
