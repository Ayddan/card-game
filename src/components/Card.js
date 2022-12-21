import React, { useContext, useEffect, useState } from 'react'
import { DeckContext } from '../App'
import CardImage from '../assets/deck/back.png'

const Card = (props) => {
    const { initialTranslateY, cardPos, packCount, cardName } = props

    const { deck, setDeckData, cardHold,setCardHoldName, setCardDroppedName } = useContext(DeckContext)
    const [cardIdentity, setCardIdentity] = useState(null)
    const [isMouseHold, setMouseHold] = useState(false)

    const [translateX, setTranslateX] = useState(null)
    const [translateY, setTranslateY] = useState(-initialTranslateY)
    const [startClickCoord, setStartClickCoord] = useState({})
    const [transitionDuration, setTransitionDuration] = useState(0)

    const mouseHold = (e) =>{
            setStartClickCoord({
                x: e.clientX,
                y: e.clientY
            })
            setMouseHold(true)
            props.cardHold(cardPos)
    }

    const mouseUp = (e) => {
            setMouseHold(false)
            window.removeEventListener("mousemove", mouseMove)
            setTransitionDuration(.3)
            setTranslateX(0)
            setTranslateY(-initialTranslateY)
    }

    const mouseMove = (e) => {
        setTransitionDuration(0)
        let diffY = e.clientY - startClickCoord.y
        let diffX = e.clientX - startClickCoord.x
        setTranslateX(translateX + diffX)
        setTranslateY(translateY + diffY)
    }

    const mouseClick = (e) => {
        // Return card only if upper of pack and if she is back face
        if(!isMouseHold && (packCount - 1) === cardPos && cardName === 'back'){
            // let index = Math.floor(Math.random()*deck.length)
            // let card = deck[index]
            // deck.splice(index, 1)
            props.cardDiscovered()
        }
    }

    useEffect(()=>{
        if(isMouseHold){
            window.addEventListener('mousemove',mouseMove)
            window.addEventListener('mouseup', mouseUp)
        }else{
            window.removeEventListener("mousemove", mouseMove)
            window.removeEventListener('mouseup', mouseUp)
        }
    },[isMouseHold])

    return(
        <div className='card'
            style={{
                transform: `translate(${translateX ? translateX : 0}px,${translateY ? translateY : -initialTranslateY}px)`, 
                transition: `transform ${transitionDuration}s ease`,
                background: `url(/deck/${cardName}.png)`,
                zIndex: isMouseHold ? 1000 : 0,
            }} 
            onMouseUp={(e)=>mouseUp(e)}
            onMouseDown={(e)=>{mouseHold(e)}}
            onClick={(e)=>mouseClick(e)}
            >
        </div>
    )
}

export default Card