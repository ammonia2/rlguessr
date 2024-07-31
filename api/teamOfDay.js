import {sql} from '@vercel/postgres'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pg;

const databaseUrl = process.env.POSTRES_URL

let teams = [
    { name: "Elevate", region: "APAC", rlcsLans: "3", yearJoined: "2021", winRate: "70.19", winnings:"94,164", active:"false", page:"https://liquipedia.net/rocketleague/Elevate" },
    { name: "Gaimin Gladiators", region: "APAC", rlcsLans: "5", yearJoined: "2022", winRate: "71.7", winnings:"129,000", active:"true", page:"https://liquipedia.net/rocketleague/Gaimin_Gladiators" },
    { name: "DeToNator", region: "APAC", rlcsLans: "1", yearJoined: "2021", winRate: "69.23", winnings:"67,772", active:"false", page:"https://liquipedia.net/rocketleague/DeToNator" },
    { name: "01 Esports", region: "MENA", rlcsLans: "1", yearJoined: "2022", winRate: "59.18", winnings:"140,653", active:"false", page:"https://liquipedia.net/rocketleague/01_Esports" },
    { name: "Rule One", region: "MENA", rlcsLans: "3", yearJoined: "2022", winRate: "80.47", winnings:"528,458", active:"false", page:"https://liquipedia.net/rocketleague/Rule_One" },
    { name: "Team Falcons", region: "MENA", rlcsLans: "7", yearJoined: "2021", winRate: "79.57", winnings:"1,023,247", active:"true", page:"https://liquipedia.net/rocketleague/Team_Falcons" },
    { name: "Bravado Gaming", region: "MENA", rlcsLans: "1", yearJoined: "2021", winRate: "74.23", winnings:"46,293", active:"true", page:"https://liquipedia.net/rocketleague/Bravado_Gaming" },
    { name: "Twisted Minds", region: "MENA", rlcsLans: "2", yearJoined: "2022", winRate: "62.71", winnings:"157,922", active:"true", page:"https://liquipedia.net/rocketleague/Twisted_Minds" },
    { name: "Optic Gaming", region: "NA", rlcsLans: "3", yearJoined: "2021", winRate: "55.21", winnings:"120,000", active:"false", page:"https://liquipedia.net/rocketleague/OpTic_Gaming" },
    { name: "G2 Esports", region: "NA", rlcsLans: "13", yearJoined: "2016", winRate: "69.23", winnings:"1,950,947", active:"true", page:"https://liquipedia.net/rocketleague/G2_Esports" },
    { name: "Shopify Rebellion", region: "NA", rlcsLans: "0", yearJoined: "2021", winRate: "59.22", winnings:"131,378", active:"true", page:"https://liquipedia.net/rocketleague/Shopify_Rebellion" },
    { name: "OG Esports", region: "NA", rlcsLans: "2", yearJoined: "2024", winRate: "60", winnings:"35,400", active:"true", page:"https://liquipedia.net/rocketleague/OG" },
    { name: "Cloud9", region: "NA", rlcsLans: "4", yearJoined: "2017", winRate: "66.67", winnings:"618,691", active:"false", page:"https://liquipedia.net/rocketleague/Cloud9" },
    { name: "Version1", region: "NA", rlcsLans: "4", yearJoined: "2020", winRate: "55.75", winnings:"888,410", active:"false", page:"https://liquipedia.net/rocketleague/Version1" },
    { name: "Rogue", region: "NA", rlcsLans: "2", yearJoined: "2017", winRate: "53.71", winnings:"477,520", active:"false", page:"https://liquipedia.net/rocketleague/Rogue" },
    { name: "NRG", region: "NA", rlcsLans: "10", yearJoined: "2016", winRate: "70.92", winnings:"1,528,845", active:"true", page:"https://liquipedia.net/rocketleague/NRG" },
    { name: "Gen.G Mobil1 Racing", region: "NA", rlcsLans: "6", yearJoined: "2022", winRate: "65.68", winnings:"594,450", active:"true", page:"https://liquipedia.net/rocketleague/Gen.G_Mobil1_Racing" },
    { name: "Spacestation Gaming", region: "NA", rlcsLans: "8", yearJoined: "2018", winRate: "68.62", winnings:"1,045,861", active:"true", page:"https://liquipedia.net/rocketleague/Spacestation_Gaming" },
    { name: "Luminosity Gaming", region: "NA", rlcsLans: "1", yearJoined: "2022", winRate: "57.4", winnings:"114,450", active:"false", page:"https://liquipedia.net/rocketleague/Luminosity_Gaming" },
    { name: "Team Reciprocity", region: "EU", rlcsLans: "2", yearJoined: "2019", winRate: "54.84", winnings:"84,929", active:"false", page:"https://liquipedia.net/rocketleague/Team_Reciprocity" },
    { name: "Hogan Mode", region: "EU", rlcsLans: "0", yearJoined: "2023", winRate: "65.91", winnings:"23,000", active:"false", page:"https://liquipedia.net/rocketleague/Hogan_Mode" },
    { name: "Flipsid3 Tactics", region: "EU", rlcsLans: "4", yearJoined: "2015", winRate: "73.79", winnings:"290,589", active:"false", page:"https://liquipedia.net/rocketleague/FlipSid3_Tactics" },
    { name: "IBUYPOWER", region: "NA", rlcsLans: "1", yearJoined: "2015", winRate: "73.44", winnings:"33,818", active:"false", page:"https://liquipedia.net/rocketleague/IBUYPOWER" },
    { name: "The Peeps", region: "NA", rlcsLans: "0", yearJoined: "2018", winRate: "66.67", winnings:"151,430", active:"false", page:"https://liquipedia.net/rocketleague/The_Peeps" },
    { name: "Team Envy", region: "NA", rlcsLans: "2", yearJoined: "2017", winRate: "65.18", winnings:"460,651", active:"false", page:"https://liquipedia.net/rocketleague/Team_Envy" },
    { name: "Moist Esports", region: "EU", rlcsLans: "5", yearJoined: "2022", winRate: "59.76", winnings:"441,615", active:"false", page:"https://liquipedia.net/rocketleague/Moist_Esports" },
    { name: "TSM", region: "NA", rlcsLans: "0", yearJoined: "2019", winRate: "54.92", winnings:"114,285", active:"true", page:"https://liquipedia.net/rocketleague/TSM" },
    { name: "Oxygen Esports", region: "EU", rlcsLans: "4", yearJoined: "2020", winRate: "61.65", winnings:"383,176", active:"true", page:"https://liquipedia.net/rocketleague/Oxygen_Esports" },
    { name: "FaZe Clan", region: "NA", rlcsLans: "7", yearJoined: "2021", winRate: "64.57", winnings:"938,370", active:"false", page:"https://liquipedia.net/rocketleague/FaZe_Clan" },
    { name: "Team Liquid", region: "EU", rlcsLans: "5", yearJoined: "2020", winRate: "55.95", winnings:"507,121", active:"false", page:"https://liquipedia.net/rocketleague/Team_Liquid" },
    { name: "Team Vitality", region: "EU", rlcsLans: "9", yearJoined: "2018", winRate: "66.52", winnings:"2,107,625", active:"true", page:"https://liquipedia.net/rocketleague/Team_Vitality" },
    { name: "Team BDS", region: "EU", rlcsLans: "8", yearJoined: "2020", winRate: "75.19", winnings:"2,162,163", active:"true", page:"https://liquipedia.net/rocketleague/Team_BDS" },
    { name: "Karmine Corp", region: "EU", rlcsLans: "7", yearJoined: "2021", winRate: "68.26", winnings:"894,323", active:"true", page:"https://liquipedia.net/rocketleague/Karmine_Corp" },
    { name: "Dignitas", region: "NA", rlcsLans: "7", yearJoined: "2018", winRate: "57.8", winnings:"927,850", active:"true", page:"https://liquipedia.net/rocketleague/Dignitas" },
    { name: "Gentle Mates Alpine", region: "EU", rlcsLans: "2", yearJoined: "2024", winRate: "72.73", winnings:"141,100", active:"true", page:"https://liquipedia.net/rocketleague/Gentle_Mates_Alpine" },
    { name: "Solary", region: "EU", rlcsLans: "0", yearJoined: "2020", winRate: "54.24", winnings:"147,682", active:"true", page:"https://liquipedia.net/rocketleague/Solary" },
    { name: "Team Queso", region: "EU", rlcsLans: "1", yearJoined: "2020", winRate: "67.67", winnings:"280,713", active:"false", page:"https://liquipedia.net/rocketleague/Team_Queso" },
    { name: "FURIA Esports", region: "SAM", rlcsLans: "7", yearJoined: "2021", winRate: "76.54", winnings:"1,219,700", active:"true", page:"https://liquipedia.net/rocketleague/FURIA_Esports" },
    { name: "Ninjas in Pyjamas", region: "SAM", rlcsLans: "2", yearJoined: "2023", winRate: "71.65", winnings:"101,750", active:"true", page:"https://liquipedia.net/rocketleague/Ninjas_in_Pyjamas" },
    { name: "Team Secret", region: "SAM", rlcsLans: "7", yearJoined: "2017", winRate: "65.9", winnings:"247,063", active:"true", page:"https://liquipedia.net/rocketleague/Team_Secret" },
    { name: "Complexity Gaming", region: "SAM", rlcsLans: "6", yearJoined: "2018", winRate: "62.13", winnings:"458,472", active:"true", page:"https://liquipedia.net/rocketleague/Complexity_Gaming" },
    { name: "Ground Zero Gaming", region: "OCE", rlcsLans: "4", yearJoined: "2018", winRate: "67.7", winnings:"382,977", active:"true", page:"https://liquipedia.net/rocketleague/Ground_Zero_Gaming" },
    { name: "Chiefs Esports Club", region: "OCE", rlcsLans: "4", yearJoined: "2017", winRate: "74.09", winnings:"163,515", active:"true", page:"https://liquipedia.net/rocketleague/Chiefs_Esports_Club" },
    { name: "Pioneers", region: "OCE", rlcsLans: "7", yearJoined: "2020", winRate: "60.89", winnings:"255,262", active:"true", page:"https://liquipedia.net/rocketleague/Pioneers" },
    { name: "PWR", region: "OCE", rlcsLans: "6", yearJoined: "2021", winRate: "73.95", winnings:"185,057", active:"true", page:"https://liquipedia.net/rocketleague/PWR" },
    { name: "Limitless", region: "SSA", rlcsLans: "2", yearJoined: "2022", winRate: "72.5", winnings:"99,530", active:"true", page:"https://liquipedia.net/rocketleague/Limitless" },
]

let teamOfDay = null

async function setTeamOfDay() {
    const today = new Date().toISOString().split('T')[0]

    console.log("Connecting ..")

    const pool = new Pool({ connectionString:databaseUrl, connectionTimeoutMillis: 5000 })
    await pool.query(`
        CREATE TABLE IF NOT EXISTS curr(
            id SERIAL PRIMARY KEY,
            name TEXT,
            region TEXT,
            rlcsLans INT,
            yearJoined INT,
            winRate DECIMAL(5, 2),
            winnings TEXT,
            active BOOLEAN,
            page TEXT,
            date DATE
        )
    `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS prev(
            id SERIAL PRIMARY KEY,
            name TEXT,
            region TEXT,
            rlcsLans INT,
            yearJoined INT,
            winRate DECIMAL(5, 2),
            winnings TEXT,
            active BOOLEAN,
            page TEXT,
            date DATE
        )
    `)
    let teamOfDay = null
    const res = await pool.query(`SELECT * FROM curr WHERE date = $1`, [today])
    
    if (res.rowCount === 0) {
        teamOfDay = teams[Math.floor(Math.random() * teams.length)]
        console.log("New team of day:", teamOfDay)

        const prevTeams = await pool.query(`SELECT name FROM prev WHERE date > $1`, [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)])
        while (prevTeams.rows.some(row => row.name === teamOfDay.name)) {
            teamOfDay = teams[Math.floor(Math.random() * teams.length)]
        }

        await pool.query(`DELETE FROM curr`)
        await pool.query(`
            INSERT INTO curr (name, region, rlcsLans, yearJoined, winRate, winnings, active, page, date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [teamOfDay.name, teamOfDay.region, teamOfDay.rlcsLans, teamOfDay.yearJoined, teamOfDay.winRate, teamOfDay.winnings, teamOfDay.active, teamOfDay.page, today])

        await pool.query(`
            INSERT INTO prev (name, region, rlcsLans, yearJoined, winRate, winnings, active, page, date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [teamOfDay.name, teamOfDay.region, teamOfDay.rlcsLans, teamOfDay.yearJoined, teamOfDay.winRate, teamOfDay.winnings, teamOfDay.active, teamOfDay.page, today])
    } else {
        teamOfDay = res.rows[0]
    }
    return teamOfDay
}

export default async function reqHandler(req, res) {
    console.log('API route hit:', req.method, req.url)
    if (req.method === 'GET') {
        try {
            const teamOfDay = await setTeamOfDay()
            console.log("TEAM OF DAY:", teamOfDay)
            res.json(teamOfDay)
        } catch (error) {
            console.error("Error in request handler:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    } else {
        res.status(405).json({ error: "Method not allowed" })
    }
}