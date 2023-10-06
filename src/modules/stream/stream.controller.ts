import {Router, Response, Request, NextFunction} from 'express'
import WebTorrent, { Torrent, TorrentFile } from 'webtorrent'

const router = Router()
const client = new WebTorrent()

let state = {
  progress: 0,
  downloadspeed: 0,
  ratio: 0
}

let error;

client.on('error', (err: Error) => {
  console.error('err', err.message)
  error = err.message
})

client.on('torrent', () => {
  console.log(client.progress)
  state = {
    progress: Math.round(client.progress * 100 * 100) / 100,
    downloadspeed: client.downloadSpeed,
    ratio: client.ratio
  }
})

router.get('/add/:magnet', (req: Request, res: Response) => {
const magnet = req.params.magnet

client.add(magnet, torrent => {
    const files = torrent.files.map(data => ({
      name: data.name, 
      length: data.length,
    }))

    res.status(200).send(files)
  })

})

router.get('/stats', (req: Request, res: Response) => {
  state = {
    progress: Math.round(client.progress * 100 * 100) / 100,
    downloadspeed: client.downloadSpeed,
    ratio: client.ratio
  }
  res.status(200).send(state)
})

//stream
interface StreamRequst extends Request {
  params: {
    magnet: string;
    fileName: string
  }
  headers: {
    range: string
  }
}
router.get(
  'stream/:magnet/:fileName', 
  (req: Request, res: Response, next: NextFunction) => {
    const { magnet, fileName } = req.params

    const torrentFile = client.get(magnet) as Torrent
    let file = {}

    for(let i = 0; i < torrentFile.files.length; i++) {
      const currentTorrentPiece = torrentFile.files[i]
    }
})

export default router