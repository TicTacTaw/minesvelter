import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes'

const KEY = 'U2FsdGVkX1+Piys10dGFDKSUdvdjB3ICSnRTBU26zr4='

export const isAround = (cell1, cell2) =>
  (cell2.x === cell1.x - 1 && cell2.y === cell1.y - 1) ||
  (cell2.x === cell1.x && cell2.y === cell1.y - 1) ||
  (cell2.x === cell1.x + 1 && cell2.y === cell1.y - 1) ||
  (cell2.x === cell1.x - 1 && cell2.y === cell1.y) ||
  (cell2.x === cell1.x + 1 && cell2.y === cell1.y) ||
  (cell2.x === cell1.x - 1 && cell2.y === cell1.y + 1) ||
  (cell2.x === cell1.x && cell2.y === cell1.y + 1) ||
  (cell2.x === cell1.x + 1 && cell2.y === cell1.y + 1)

export const formatTime = (time) => {
  return (time / 1000).toFixed(1)
}

export const getScore = ({ x, y, mines, flagless }) => {
  const savedScores = localStorage.getItem('scores')

  if (!savedScores) {
    return null
  }

  const decryptedScores = AES.decrypt(savedScores, KEY).toString(
    CryptoJS.enc.Utf8
  )

  const scores = JSON.parse(decryptedScores)

  return scores[`${x}-${y}-${mines}-${flagless}`] || null
}

export const saveHighScore = ({ x, y, mines, flagless }, time) => {
  const savedScores = localStorage.getItem('scores')
  const gameKey = `${x}-${y}-${mines}-${flagless}`
  const gameScore = {
    [gameKey]: time,
  }

  if (!savedScores) {
    localStorage.setItem('scores', AES.encrypt(JSON.stringify(gameScore), KEY))
    return
  }

  const decryptedScores = AES.decrypt(savedScores, KEY).toString(
    CryptoJS.enc.Utf8
  )

  const scores = JSON.parse(decryptedScores)

  if (!scores[gameKey] || scores[gameKey] > time) {
    localStorage.setItem(
      'scores',
      AES.encrypt(JSON.stringify({ ...scores, [gameKey]: time }), KEY)
    )
  }
}
