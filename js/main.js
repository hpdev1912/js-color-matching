import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getInActiveColorList,
  getColorElementList,
  getColorListElement,
  getTimerElement,
  getPlayAgainButton,
  getStartGameButton,
  getColorBackground,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hideReplayButton,
  setBackgroundColor,
  setTimerText,
  showReplayButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timeLock = null

const timerCountDown = createTimer(GAME_TIME, onTimerChange, onTimerFinish)
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

//issue
//handleOverlayClick1
//handleOverlayClick2
//handleOverlayClick3
//setTimeout2 ->run
//setTimeout3 -> error
function handleOverlayClick(liElement) {
  const shouldBlockClick = [
    GAME_STATUS.BLOCKING,
    GAME_STATUS.FINISHED,
    GAME_STATUS.PENDING,
  ].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || isClicked || shouldBlockClick) return
  liElement.classList.add('active')

  selections.push(liElement)
  if (selections.length < 2) return

  //check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    setBackgroundColor(firstColor)
    //check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      //show you win
      setTimerText('YOU WIN 🎉')
      //show replay button
      showReplayButton()

      gameStatus = GAME_STATUS.FINISHED
      timerCountDown.end()
    }
    selections = []
    return
  }
  //block click when setTimeout run
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    //reset selections
    //if reset outside it will be impacted by callback queue syns/asyns
    //Bug: will be reset selections array before remove classList

    selections = []
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function initColor() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  const colorElementList = getColorElementList()
  colorElementList.forEach((colorElement, index) => {
    colorElement.dataset.color = colorList[index]
    const liElement = colorElement.querySelector('.overlay')
    if (liElement) {
      liElement.style.backgroundColor = colorList[index]
    }
  })
  timerCountDown.start()
}

function attachEvent() {
  const ulElement = getColorListElement()
  if (!ulElement) return
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleOverlayClick(event.target)
  })
}

function onTimerChange(timer) {
  const formatTimer = `0${timer}`.slice(-2)
  setTimerText(`${formatTimer}s`)
}

function onTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED
  //show you win
  setTimerText('GAME OVER')
  showReplayButton()
}

function resetGame() {
  //reset global vars
  gameStatus = GAME_STATUS.PLAYING
  selections = []
  //reset DOM
  //remove class active of li
  const colorElementList = getColorElementList()
  if (!colorElementList) return
  colorElementList.forEach((element) => {
    element.classList.remove('active')
  })
  //clear Timer text
  setTimerText('')
  //hide replay button
  hideReplayButton()
  //reset background color
  setBackgroundColor('goldenrod')
  //reset color random
  initColor()
}

function attachEventReplayButton() {
  const replayButton = getPlayAgainButton()
  if (!replayButton) return
  replayButton.addEventListener('click', resetGame)
}

//main
;(() => {
  const startGameButton = getStartGameButton()
  startGameButton.addEventListener('click', () => {
    startGameButton.classList.remove('show')
    initColor()
    //attach event
    attachEvent()

    //attack event for replay button
    attachEventReplayButton()
  })
})()
