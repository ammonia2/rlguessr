import fs from 'fs'
import path from 'path'
import { fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const teamOfDayFilePath = path.join(__dirname, 'data', 'globalData.json')

export default function reqHandler(req, res) {
    fs.readFile(teamOfDayFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' })
        
        let fileData = JSON.parse(data)
        const gamesPlayed = fileData.gamesPlayed || 0
        const gamesWon = fileData.gamesWon || 0

        res.json({ gamesPlayed, gamesWon })
    })
}