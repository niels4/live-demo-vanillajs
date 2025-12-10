console.log("State example page 2....")

const clickMeButton = document.getElementById('click-me-button')
const resetButton = document.getElementById('reset-button')
const clickCountEle = document.getElementById('click-count')

const state = liveState({
  clickCount: 0
})
clickCountEle.innerText = state.clickCount

const setClickCount = (clickCount) => {
  state.clickCount = clickCount
  clickCountEle.innerText = state.clickCount
}


clickMeButton.addEventListener('click', () => {
  setClickCount(state.clickCount + 1)
})

resetButton.addEventListener('click', () => {
  setClickCount(0)
})
