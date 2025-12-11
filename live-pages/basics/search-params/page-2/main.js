console.log("Search Params example page 2....")

const clickMeButton = document.getElementById("click-me-button")
const resetButton = document.getElementById("reset-button")
const clickCountEle = document.getElementById("click-count")

let clickCount

liveSearchParams((params) => {
  clickCount = Number(params.get("count") ?? 0)
  clickCountEle.innerText = clickCount
})

const setClickCount = (clickCount) => {
  if (clickCount === 0) {
    setLiveSearchParams({ count: null })
    return
  }
  setLiveSearchParams({ count: clickCount })
}

clickMeButton.addEventListener("click", () => {
  setClickCount(clickCount + 1)
})

resetButton.addEventListener("click", () => {
  setClickCount(0)
})
