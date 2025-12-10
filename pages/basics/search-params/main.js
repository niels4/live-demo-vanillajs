console.log("Search Params example page 1...")

const clickMeButton = document.getElementById('click-me-button')
const resetButton = document.getElementById('reset-button')
const clickCountEle = document.getElementById('click-count')

let clickCount

wtrSearchParams((params) => {
  clickCount = Number(params.get('count') ?? 0)
  clickCountEle.innerText = clickCount
})

const setClickCount = (clickCount) => {
  console.log("Setting search params will be implemented in the future", clickCount)
}

clickMeButton.addEventListener('click', () => {
  setClickCount(clickCount + 1)
})

resetButton.addEventListener('click', () => {
  setClickCount(0)
})
