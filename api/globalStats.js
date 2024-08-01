import pg from 'pg'

const { Pool } = pg;
const databaseUrl = process.env.POSTRES_URL

export default async function reqHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const pool = new Pool({connectionString: databaseUrl, connectionTimeoutMillis: 5000})
            await pool.query(`
                CREATE TABLE IF NOT EXISTS stats (
                    id SERIAL PRIMARY KEY,
                    played INT,
                    won INT
                )
            `)

            const data = await pool.query(` SELECT * FROM stats `)
            const won = data.rows[0]?.won || 0
            const played = data.rows[0]?.played || 0

            res.json({ gamesPlayed: won, gamesWon: played })
        } 
        catch (error) {
            console.error("Error in request handler", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }
    else if (req.method === 'PUT') {
        try {
            const pool = new Pool({connectionString: databaseUrl, connectionTimeoutMillis: 5000})
            await pool.query(`
                CREATE TABLE IF NOT EXISTS stats (
                    id SERIAL PRIMARY KEY,
                    played INT,
                    won INT
                )
            `)
            const {gameStatus} = req.body

            const data = await pool.query(` SELECT * FROM stats `)
            const won = data.rows[0]?.won || 0
            const played = data.rows[0]?.played || 0

            await pool.query(`DELETE FROM stats`)
            await pool.query(`INSERT INTO stats (played, won)
                VALUES ($1, $2)    
            `, [played + 1, won + (gameStatus === 'won' ? 1 : 0)])

            res.json({ gamesPlayed: played + 1, gamesWon: won + (gameStatus === 'won' ? 1 : 0) })
        }
        catch (error) {
            console.error("Error in request handler", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }
}