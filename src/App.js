import React, { createContext, useEffect, useState } from 'react'

// Components
import CardHolder from './components/CardHolder'

// Styles
import './styles/css/style.css'

export const DeckContext = createContext([])

function App() {
  const [ colors, setColors ] = useState([
    'spades','hearts','clover','tiles'
  ])
  const [ deck, setDeck ] = useState([])
  const [userCards, setUserCards] = useState([
    ['back'],
    ['back','back'],
    ['back','back','back'],
    ['back','back','back','back']
  ])
  const [userBank, setuserBank] = useState([
    'back','back','back','back','back','back',
    'back','back','back','back','back','back',
  ])
  const [sideCards, setSideCards] = useState([
    ['back','back','back','back','back'],
    ['back','back','back','back','back']
  ])
  const [middleCards, setMiddleCards] = useState([
    [],[]
  ])
  const [jockersCards,setJockersCards] = useState([])
  const [canAddMiddleCard, setCanAddMiddleCard] = useState(true) 
  const [cardHoldData,setCardHoldData] = useState()

  const addCardOnMiddle = () =>{
    let i = 0
    for(let c of middleCards){
      let index = Math.floor(Math.random()*deck.length)
      let card = deck[index]
      deck.splice(index, 1)
      let newMiddleCards = middleCards
      newMiddleCards[middleCards.indexOf(c)].push(card)
      setMiddleCards([...newMiddleCards])
      let newSideCards = sideCards
      newSideCards[i].splice(0, 1)
      setSideCards([...newSideCards])
      setCanAddMiddleCard(false)
      i++
    }
  }

  const cardDiscovered = (holderPos) => {
    let index = Math.floor(Math.random()*deck.length)
    let card = deck[index]
    deck.splice(index, 1)
    let newUserCards = userCards
    newUserCards[holderPos][newUserCards[holderPos].length-1] = card
    setUserCards([...newUserCards])
  }

  const userBankCardDiscovered = () => {
    let emptyUserSlot = null
    let cardsBackCount = 0
    for(let s of userCards){
      if(s.length === 0) emptyUserSlot = userCards.indexOf(s)
      if(s.includes('back')) cardsBackCount++
    }
    if(emptyUserSlot != null && cardsBackCount === 0){
      let index = Math.floor(Math.random()*deck.length)
      let card = deck[index]
      deck.splice(index, 1)
      let newUserCards = userCards
      newUserCards[emptyUserSlot][0] = card
      setUserCards([...newUserCards])
    }
  }

  const newCardHold = (cardPos,holderPos) => {
    setCardHoldData({
      from: 'user-hand',
      holderPos: holderPos,
      cardPos: cardPos
    })
  }

  const newJokerHold = (cardPos,holderPos) => {
    setCardHoldData({
      from: 'joker-hand',
      holderPos: holderPos,
      cardPos: cardPos
    })
  }

  const newJokerCardDrop = () => {
    let droppedCardInfo = userCards[cardHoldData.holderPos][cardHoldData.cardPos].split('-')
    if(cardHoldData != undefined && droppedCardInfo[0] === 'joker'){
      let newUserCards = userCards
      let newJockersCards = jockersCards
      newJockersCards.push(userCards[cardHoldData.holderPos][cardHoldData.cardPos])
      newUserCards[cardHoldData.holderPos].splice(cardHoldData.cardPos, 1)
      setUserCards([...newUserCards])
      setJockersCards([...newJockersCards])
    }
  }

  const newMiddleCardDrop = (droppedHolderPos) => {
    let droppedHolderFirstCardInfos = middleCards[droppedHolderPos][middleCards[droppedHolderPos].length-1].split('-')
    let droppedCardInfo = userCards[cardHoldData.holderPos][cardHoldData.cardPos].split('-')
    let isCardInf = (parseInt(droppedHolderFirstCardInfos[0]) - 1 === parseInt(droppedCardInfo[0]))
    let isCardSup = (parseInt(droppedHolderFirstCardInfos[0]) + 1 === parseInt(droppedCardInfo[0]))
    let isCycleCase = parseInt(droppedHolderFirstCardInfos[0]) + parseInt(droppedCardInfo[0]) === 14 || parseInt(droppedHolderFirstCardInfos[0]) - parseInt(droppedCardInfo[0]) === -12
    let isDroppedCardJoker = cardHoldData.from === 'joker-hand'
    let isHolderCardJoker = droppedHolderFirstCardInfos[0] === 'joker'
    console.log(isDroppedCardJoker)
    console.log(droppedCardInfo + ' ' + droppedHolderFirstCardInfos)
    if(cardHoldData != undefined && (isCardInf || isCardSup || isCycleCase || isDroppedCardJoker || isHolderCardJoker)){
      if(isDroppedCardJoker){
        let newJockersCards = jockersCards
        let newMiddleCards = middleCards
        newMiddleCards[droppedHolderPos].push(jockersCards[cardHoldData.cardPos])
        newJockersCards.splice(cardHoldData.cardPos, 1)
        setJockersCards([...newJockersCards])
        setMiddleCards([...newMiddleCards])
      }else{
        let newUserCards = userCards
        let newMiddleCards = middleCards
        newMiddleCards[droppedHolderPos].push(userCards[cardHoldData.holderPos][cardHoldData.cardPos])
        newUserCards[cardHoldData.holderPos].splice(cardHoldData.cardPos, 1)
        setUserCards([...newUserCards])
        setMiddleCards([...newMiddleCards])
      }
    }
  }

  const newCardDrop = (droppedHolderPos) => {
    // console.log('dropped holder first card : ' + userCards[droppedHolderPos][userCards[droppedHolderPos].length-1])
    // console.log('dropped Card : ' + userCards[cardHoldData.holderPos][cardHoldData.cardPos])
    if(userCards[droppedHolderPos].length === 0){
      let newUserCards = userCards
      newUserCards[droppedHolderPos].push(userCards[cardHoldData.holderPos][cardHoldData.cardPos])
      newUserCards[cardHoldData.holderPos].splice(cardHoldData.cardPos, 1)
      setUserCards([...newUserCards])
    }else{
      /**
       * Cards infos index
       * 0 = value | 1 = family
       */
      let droppedHolderFirstCardInfos = userCards[droppedHolderPos][userCards[droppedHolderPos].length-1].split('-')
      let droppedCardInfo = userCards[cardHoldData.holderPos][cardHoldData.cardPos].split('-')
      if(cardHoldData != undefined && parseInt(droppedCardInfo[0]) === parseInt(droppedHolderFirstCardInfos[0])){
        let newUserCards = userCards
        newUserCards[droppedHolderPos].push(userCards[cardHoldData.holderPos][cardHoldData.cardPos])
        newUserCards[cardHoldData.holderPos].splice(cardHoldData.cardPos, 1)
        setUserCards([...newUserCards])
      }
    }
  }


  useEffect(()=>{
    /**
     * Fill deck at start
     */
    let newDeck = ['joker-1','joker-2']
    for(let c of colors){
      for(let i = 1; i <= 13; i++){
        newDeck.push(`${i}-${c}`)
      }
    }
    const shuffledArray = newDeck.sort((a, b) => 0.5 - Math.random());
    setDeck(shuffledArray)
  },[])

  useEffect(()=>{
    console.log(cardHoldData)
  },[cardHoldData])

  useEffect(()=>{
    if(canAddMiddleCard && deck.length > 0){
      console.log(deck)
      addCardOnMiddle()
    }
  },[canAddMiddleCard,deck])

  return (
    <div className="App">
      <DeckContext.Provider value={{
        deck: deck,
        setDeckData: (data)=> setDeck(data),
      }}>
        <div className='table'>
          <button onClick={()=>setCanAddMiddleCard(true)}>New cards</button>
          <div className='middle-packs'>
            <div className='side-cards-1'>
              <CardHolder 
                holderPos={0} 
                stackGap={5} 
                maxCount={sideCards[0].length} 
                cards={sideCards[0]}
              />
            </div>
            <div className='game-center'>
              <CardHolder 
                holderPos={0}
                stackGap={1}
                maxCount={middleCards[0].length}
                cards={middleCards[0]}
                cardHoldData={cardHoldData}
                cardDrop={(holderPos)=>newMiddleCardDrop(holderPos)}
              />
              <CardHolder 
                holderPos={1}
                stackGap={1}
                maxCount={middleCards[1].length}
                cards={middleCards[1]}
                cardHoldData={cardHoldData}
                cardDrop={(holderPos)=>newMiddleCardDrop(holderPos)}
              />
            </div>
            <div className='side-cards-2'>
              <CardHolder 
                holderPos={0} 
                stackGap={5} 
                maxCount={sideCards[1].length} 
                cards={sideCards[1]}
              />
            </div>
          </div>
          <div className='user-hand'>
            <div className='user-bank'>
              <CardHolder
                holderPos={0}
                stackGap={5}
                maxCount={userBank.length}
                cards={userBank}
                canHold={true}
                cardHoldData={cardHoldData}
                cardDiscovered={(holderPos)=>userBankCardDiscovered()}
                cardHold={(cardPos,holderPos)=>newCardHold(cardPos,holderPos)}
                cardDrop={(holderPos)=>console.log(holderPos)}
                />
            </div>
            {userCards.map((c,i)=>(
              <CardHolder key={i} 
                holderPos={i} 
                stackGap={40} 
                maxCount={c.length} 
                cards={c}
                canHold={true}
                cardHoldData={cardHoldData}
                cardDiscovered={(holderPos)=>cardDiscovered(holderPos)}
                cardHold={(cardPos,holderPos)=>newCardHold(cardPos,holderPos)}
                cardDrop={(holderPos)=>newCardDrop(holderPos)}
                />
            ))}
            <div className='jokers-hand'>
              <CardHolder 
                holderPos={0}
                stackGap={40}
                maxCount={jockersCards.length}
                cards={jockersCards}
                canHold={true}
                cardHoldData={cardHoldData}
                cardHold={(cardPos,holderPos)=>newJokerHold(cardPos,holderPos)}
                cardDrop={(holderPos)=>newJokerCardDrop (holderPos)}
                />
            </div>
          </div>
        </div>
      </DeckContext.Provider>
    </div>
  );
}

export default App;
