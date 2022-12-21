import React, { useContext, useEffect, useRef, useState } from 'react'
import { DeckContext } from '../App'
import Card from './Card'

const CardHolder = (props) => {
    const { stackGap, maxCount, cards, holderPos, cardHoldData, canHold } = props

    // const [hovered, setHovered] = useState(false)
    const cardHolder = useRef()

    const dropCard = () => {
        props.cardDrop(holderPos)
    }

    const mouseUp = (e) =>{
        window.removeEventListener('mouseup',mouseUp)
        let rect = cardHolder.current.getBoundingClientRect()
        let x = e.clientX;
        if (x < rect.left || x >= rect.right)return
        let y = e.clientY;
        if (y < rect.top || y >= rect.bottom)return
        dropCard()
    }

    useEffect(()=>{
        if(cardHoldData){
            window.addEventListener('mouseup',mouseUp)
        }
    },[cardHoldData])

    // const customHover = (hovered) => {
    //     if(hovered) setHovered(true)
    //     else setHovered(false)
    // }

    return(
        <div className='card-holder'
            ref={cardHolder}
            style={{paddingTop: `${(cards.length - 1)*stackGap}px`}}
        >
            {cards.map((c, i) => (
                <Card key={i}
                    cardPos={i}
                    cardName={c}
                    initialTranslateY={i*stackGap}
                    packCount={cards.length}
                    cardHold={(cardPos)=>canHold ? props.cardHold(cardPos,holderPos) : null}
                    cardDiscovered={()=>canHold ? props.cardDiscovered(holderPos) : null}
                />
            ))}
        </div>
    )
}

export default CardHolder