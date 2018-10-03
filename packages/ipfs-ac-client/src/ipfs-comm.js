import Room from 'ipfs-pubsub-room'
import IPFS from 'ipfs'

function repo () {
  return 'ipfs/supercool/' + Math.random()
}
const ipfs = new IPFS({
  repo: repo(),
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

let serverPeer = null

const setServer = (peer, callback) => {
  if (serverPeer !== peer) {
    serverPeer = peer
    if (callback) {
      callback(serverPeer)
    }
  }
}

let comm = null

export const sendMessage = message => comm.then(room => {
  if (serverPeer) {
    return room.sendTo(serverPeer, JSON.stringify(message))
  }

  Promise.resolve()
})

export const startListener = ({ connectionCallback, messageCallback }) => {
  comm = new Promise((resolve) => {
    ipfs.once('ready', () => ipfs.id((err, info) => {
      if (err) {
        throw err
      }

      console.log('IPFS node ready with address ' + info.id)

      const room = Room(ipfs, 'supercool')

      room.on('message', ({ from, data }) => {
        try {
          const dataObj = JSON.parse(data.toString())
          if (dataObj.hasOwnProperty('acIsOn')) {
            setServer(from, connectionCallback)
          }
          if (messageCallback) {
            messageCallback(dataObj)
          }
        } catch (e) {
        }
      })

      room.on('peer left', peer => {
        if (peer === serverPeer) {
          setServer(null, connectionCallback)
        }
      })

      resolve(room)
    }))
  })
}
