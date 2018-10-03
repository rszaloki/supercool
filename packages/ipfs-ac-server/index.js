const Room = require('ipfs-pubsub-room')
const IPFS = require('ipfs')
const STATE = require('./state.js')

let myId = null

const ipfs = new IPFS({
  repo: 'supercool-repo',
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
})

ipfs.once('ready', () => ipfs.id((err, info) => {
  if (err) {
    throw err
  }
  console.log('IPFS node ready with address ' + info.id)
  myId = info.id

  const room = Room(ipfs, 'supercool')

  room.on('peer joined', (peer) => console.log(`peer ${peer} joined`))
  room.on('peer left', (peer) => console.log(`peer ${peer} left`))

  // send and receive messages

  room.on('message', (message) => {
    if (myId !== message.from) {
      const dataStr = message.data.toString()
      console.log('got message from ' + message.from + ': ', dataStr)
      try {
        const data = JSON.parse(dataStr)
        if (data.hasOwnProperty('setAc')) {
          STATE.setState(data.setAc)
        }
      } catch (e) {
        console.warn(e)
      }
    }
  })

  // broadcast message every 1 second

  setInterval(() => room.broadcast(JSON.stringify({
    acIsOn: STATE.getState()
  })), 1000)
}))
