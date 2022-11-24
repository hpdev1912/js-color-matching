import { getColorBackground, getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return

  for (let i = arr.length - 1; i > 1; i--) {
    //create an number less than i
    const j = Math.floor(Math.random() * i)
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  //random "count" colors
  for (let index = 0; index < count; index++) {
    //make sure not over hueList array
    const color = hueList[index % hueList.length]
    const hexColor = window.randomColor({ luminosity: 'dark', hue: color })
    colorList.push(hexColor)
  }

  //duplicate color make pair
  const fullColorList = [...colorList, ...colorList]
  //shuffle list
  shuffle(fullColorList)

  return fullColorList
}

export function showReplayButton() {
  const replayButton = getPlayAgainButton()
  if (!replayButton) return
  replayButton.classList.add('show')
}
export function hideReplayButton() {
  const replayButton = getPlayAgainButton()
  if (!replayButton) return
  replayButton.classList.remove('show')
}
export function setTimerText(text) {
  const gameTimer = getTimerElement()
  if (gameTimer) gameTimer.textContent = text
}

export function setBackgroundColor(color) {
  const background = getColorBackground()
  background.style.backgroundColor = color
}

export function createTimer(seconds, onChange, onFinish) {
  let interValId = null

  function start() {
    let timer = seconds
    interValId = setInterval(() => {
      //if(onChange) onChange(timer)
      onChange?.(timer)
      timer--
      if (timer < 0) {
        end()
        onFinish?.()
      }
    }, 1000)
  }

  function end() {
    clearInterval(interValId)
  }

  return {
    start,
    end,
  }
}
