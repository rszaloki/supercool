const OFF = false
const ON = true

let currentState = OFF

function setState(newState) {
  currentState = newState
}

function getState() {
  return currentState
}

module.exports = {
  setState,
  getState
}
