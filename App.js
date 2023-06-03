import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"


export default function App() {
    const [diceNumber, setDiceNumber] = React.useState(10)
function increaseDice() {
  if (diceNumber < 15) {
    setDiceNumber(diceNumber + 1)
    
  }
}

function decreaseDice() {
    if (diceNumber > 5) {
        setDiceNumber(diceNumber - 1)
    }
}
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [high, setHigh] = React.useState(1000)
    //stores if this is the first time or not important for inializing the best score to zero
    const [firstTime, setFirstTime] = React.useState(false)
    const [count, setCount] = React.useState(0)
    const [highScore, setHighScore] = React.useState(1000)
    
 
   

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
            shake: false
        }
    }
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < diceNumber; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    React.useEffect(() => { 
        setDice(allNewDice());
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            //will let know that it is the first time, won't change after, locks in place the new high score
            setFirstTime(true)
            //checks if the current count is lower than the high score it true, then stores in local storage the value
            if (count < high){localStorage.setItem('score', JSON.stringify(count))}
            
        }
        //reads the local storage value
        const items = JSON.parse(localStorage.getItem('score'))
        //sets the high score to the value from local storage
        if (items) {
            setHigh(items)
        }
    }, [diceNumber])

    

    
console.log(diceNumber)

    
  
    
   function rollDice() {
  //every time you click roll will update the number of rolls
  setCount(count => count + 1)
  const allHeld = dice.every(die => die.isHeld)
  if (!tenzies && allHeld) {
      
    setTenzies(true)
    //will let know that it is the first time, won't change after, locks in place the new high score
    setFirstTime(true)
    //update high score if current score is better
    if (count < high) {
      setHigh(count)
      localStorage.setItem('score', JSON.stringify(count))
    }
        setDice(allNewDice()) // added line to update dice values

  } else if (!tenzies) {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      })
    )
  } else {
    setTenzies(false)
    setDice(allNewDice())
    setCount(0)
  }
}
console.log(high)
console.log(count)
    //reset function that sets everything back to zero if you want to stop the current game and restart
    function restart() {
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
            //these two lines of code would do a hard reset of game
            //setFirstTime(false)
            //localStorage.clear()
    }
    
    function reset() {
            localStorage.clear()
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
            setHighScore(1000)
            setFirstTime(false)
    }
    
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            if (die.id === id) {
                return Object.assign({}, die, { isHeld: !die.isHeld });
            } else {
                return die;
            }
        }));
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
            shake={() => animate()}
            
        />
    ))
    //shake state
    const [shake, setShake] = React.useState(false);
    //shake animation
    function animate() {
        // Button begins to shake
        setShake(true);
        
        // Buttons stops to shake after 2 seconds
        setTimeout(() => setShake(false), 500);
    
    }
    
    const gameNumbers = {
        5: "Five",
        6: "Six",
        7: "Seven",
        8: "Eight",
        9: "Nine",
        10: "Ten",
        11: "Eleven",
        12: "Twelve",
        13: "Thirteen",
        14: "Fourteen",
        15: "Fifteen"
    }
 if (dice.every(die => die.isHeld && die.value === dice[0].value) && count < highScore) {
      setFirstTime(true)
      setHighScore(count);
    }
console.log(highScore)
    return (
        <main>
            <div className="increase-decrease">
            <img src="../images/arrow-ga26d3873a_1280.png" className="down--logo" onClick={decreaseDice} disabled={diceNumber === 5} />
            <img src="../images/arrow-ga26d3873a_1280.png" className="up--logo" onClick={increaseDice} disabled={diceNumber === 15} />
            </div>
            {dice.every(die => die.isHeld && die.value === dice[0].value) && <Confetti />}
            <h1 className="title">{gameNumbers[diceNumber]}zies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls. You can choose between 5 and 15 dice.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            
            {dice.every(die => die.isHeld && die.value === dice[0].value) ? <button className="roll-dices" onClick={restart}>New Game</button> :
            <button 
                className={dice.every(die => die.isHeld && die.value === dice[0].value) ? "roll-dices" : "roll-dice"} 
                onClick={rollDice}
                
            >
                Roll
            </button>}
            <div className="scores">
            <p className="score">Number of Rolls: {tenzies ? count - 1 : count} </p>
            <p className="score">Best Score: {firstTime ? highScore : 0}</p>
            </div>
            <button 
                className="restart"
                onClick={restart}
            >
                 Restart
            </button>
            <button 
                className="reset"
                onClick={reset}
            >
                 Reset
            </button>
        </main>
    )
}