<script>
  import { onMount } from 'svelte'
  import { roundToNearestThousand, roundToNearestWhole, generateUserId, watchClick, closePopup, enableCard } from './lib/utilities.js'
  import gsap from 'gsap'

  let searchQuery = ''
  var filteredTeams =[]
  let selectedIndex
  let attempts=0
  let guesses = []
  let guessLimit = [0,0,0,0,0,0]
  let teamOFDay
  let hasSolvedToday = false
  let userId
  let teamOfDayName, teamLink
  let mainContent
  
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

  let detailedStats 
  let orgCard
  let statsBtn, guessrBtn
  let gamesPl, gamesW
  let globalGamesPl, globalGamesW

  let timeRemaining = ''

  function calculateTimeRemainingUTC() {
    const now = new Date();
    const nextMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)) // Set to next midnight UTC
    const diffUTC = nextMidnightUTC.getTime() - now.getTime()

    const hoursUTC = Math.floor(diffUTC / (1000 * 60 * 60))
    const minutesUTC = Math.floor((diffUTC % (1000 * 60 * 60)) / (1000 * 60))
    const secondsUTC = Math.floor((diffUTC % (1000 * 60)) / 1000)

    timeRemaining = `${hoursUTC.toString().padStart(2, '0')}:${minutesUTC.toString().padStart(2, '0')}:${secondsUTC.toString().padStart(2, '0')}`;
  }

  async function fetchTeamOfDay() {
    try {
      const response = await fetch('/api/teamOfDay', {
        method: 'GET'
      })
      console.log(response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      teamOFDay = data
      teamOfDayName = teamOFDay.name

      console.log("Team of day name:", teamOfDayName)
    } catch (error) {
      console.error("Error fetching team of day:", error)
    }
  }

  async function fetchGlobalStats() {
    const response = await fetch('/api/globalStats', {
      method: 'GET'
    })
    const data = await response.json()
    globalGamesPl = data.gamesPlayed
    globalGamesW = data.gamesWon
  }

  async function updateGlobalStats(status) {
    try {
      const response = await fetch('/api/globalStats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameStatus: status })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('Game status updated successfully:', data)
    } catch (error) {
      console.error('Failed to update game status:', error)
    }
  }

  async function setTime() {
    calculateTimeRemainingUTC();
    const interval = setInterval(calculateTimeRemainingUTC, 1000);
    return () => clearInterval(interval)
  }

  onMount(async ()=> {
    watchClick(orgCard, detailedStats, mainContent)
    closePopup(document, orgCard, detailedStats, mainContent)
    // updateGlobalStats('won')
    // localStorage.clear()

    userId = localStorage.getItem('userId')
    if (!userId) {
      userId= generateUserId()
      localStorage.setItem('userId', userId)
    }

    await fetchTeamOfDay()
    teamLink = teamOFDay.page
    console.log(teamOFDay)

    gamesPl = localStorage.getItem(`${userId}_gamesPlayed`) ? parseInt(localStorage.getItem(`${userId}_gamesPlayed`)): 0
    gamesW = localStorage.getItem(`${userId}_gamesWon`) ? parseInt(localStorage.getItem(`${userId}_gamesWon`)): 0

    let currDate = new Date()
    const storedDateStr = localStorage.getItem(`${userId}_dateToday`)
    let isSameDay = false
    if (storedDateStr) {
      const storedDate = new Date(storedDateStr)
      isSameDay = storedDate.getUTCFullYear() === currDate.getUTCFullYear() &&
                  storedDate.getUTCMonth() === currDate.getUTCMonth() &&
                  storedDate.getUTCDate() === currDate.getUTCDate()
    }
    hasSolvedToday = isSameDay;
    const startedSolving = localStorage.getItem(`${userId}_startedSolving`)
    if (startedSolving) {
      const startedSolvingDate = new Date(startedSolving)
      isSameDay = startedSolvingDate.getUTCFullYear() === currDate.getUTCFullYear() &&
                  startedSolvingDate.getUTCMonth() === currDate.getUTCMonth() &&
                  startedSolvingDate.getUTCDate() === currDate.getUTCDate()
    }

    if (!isSameDay) localStorage.setItem(`${userId}_guessesToday`, "")
    const storedGuessesStr = localStorage.getItem(`${userId}_guessesToday`)
    if (storedGuessesStr) {
      guesses = JSON.parse(storedGuessesStr)
      attempts = guesses.length
      for (let i=0; i<attempts; i++) guessLimit[i]=1
    }

    setTime()
  })

  function handleSearch() {
    selectedIndex=-1
  }

  function handleKeyDown(event) {
    const maxIndex = filteredTeams.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (selectedIndex < maxIndex) selectedIndex++;
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (selectedIndex > 0) selectedIndex--;
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          handleSelection(filteredTeams[selectedIndex])
        }
        break;
    }
  }

  function handleSelection(team) {
      guesses = [...guesses, team]; // Ensure reactivity by creating a new array
      localStorage.setItem(`${userId}_guessesToday`, JSON.stringify(guesses))
      localStorage.setItem(`${userId}_startedSolving`, `${new Date()}`)
      guessLimit[attempts] = 1
      attempts += 1;
      searchQuery = ''
      selectedIndex =-1
      const gamesWon = localStorage.getItem(`${userId}_gamesWon`) ? parseInt(localStorage.getItem(`${userId}_gamesWon`)): 0
      const gamesPlayed = localStorage.getItem(`${userId}_gamesPlayed`) ? parseInt(localStorage.getItem(`${userId}_gamesPlayed`)): 0
      if (team.name.toLowerCase() == teamOFDay["name"].toLowerCase()) {
        hasSolvedToday =true
        localStorage.setItem(`${userId}_hasSolvedToday`, 'true')
        localStorage.setItem(`${userId}_dateToday`, `${new Date()}`)
        localStorage.setItem(`${userId}_gamesWon`, `${gamesWon+1}`)
        localStorage.setItem(`${userId}_gamesPlayed`, `${gamesPlayed+1}`)

        updateGlobalStats('won')
      } else if (attempts>=6 ) {
        hasSolvedToday=true
        updateGlobalStats('played')
        localStorage.setItem(`${userId}_gamesPlayed`, `${gamesPlayed+1}`)
      }
  }

  $: if (searchQuery) {
    filteredTeams = teams.filter(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  else {
    filteredTeams = []
  }

  $: if (hasSolvedToday) {
    enableCard(orgCard)
  }

  $: if (teamOFDay) {
    teamOfDayName = teamOFDay.name
  }

</script>

<main >
  <div bind:this={mainContent} class="staticElems">
    <h1>RL Esports Organisation Guessr</h1>

    <div class="search" >
      <div class="search-thingies">
        {#if attempts < 6 && !hasSolvedToday}
          <input 
              type="text" 
              on:input={handleSearch} 
              on:keydown={handleKeyDown} 
              placeholder="ermm... try typing a team" 
              bind:value={searchQuery}
          >
          {#if filteredTeams.length > 0}
              <ul class="options">
                  {#each filteredTeams as team, index}
                      <li>
                          <button 
                              type="button" 
                              on:mouseenter={() => handleSearch()} 
                              on:mouseleave={handleSearch} 
                              on:click={() => handleSelection(team)} 
                              class:selected={index === selectedIndex}
                          >
                              {team.name}
                          </button>
                      </li>
                  {/each}
              </ul>
          {/if}
        {/if}
        {#if attempts>0}
          <table class="guessData">
            <tr>
              <th title="Team's name">Name</th>
              <th title="Year of entering in Esports">Year</th>
              <th title="Current/Last region played in">Region</th>
              <th title="Win Rate (Series)">Win%</th>
              <th title="RLCS LANS attended">LANS</th>
              <th title="Estimated prize money won">Winnings</th>
              <th title="Has an Active Roster?">Active</th>
            </tr>
            {#each guesses as guess}
              <tr>
                <td class:green={guess.name === teamOFDay.name}
                >{guess.name}</td>
                <td
                  class={
                    guess.yearJoined == teamOFDay.yearJoined ? 'green' :
                    guess.yearJoined < teamOFDay.yearJoined ? 'less' : 
                    'greater'
                  }
                  title={
                    guess.yearJoined == teamOFDay.yearJoined ? 'Correct Year' : 
                    guess.yearJoined < teamOFDay.yearJoined ? 'Less than the correct year' : 
                    'Greater than the correct year'
                  }
                >{guess.yearJoined}
                </td>
                <td class:green={guess.region ==teamOFDay.region}
                  title={guess.region== teamOFDay.region ? "Correct region": "Incorrect region"}
                >{guess.region}
                </td>
                <td
                  class={
                    roundToNearestWhole(+guess.winRate) == roundToNearestWhole(+teamOFDay.winRate) ? 'green' :
                    roundToNearestWhole(+guess.winRate) < roundToNearestWhole(+teamOFDay.winRate) ? 'less' : 
                    'greater'
                  }
                  title={
                    roundToNearestWhole(+guess.winRate) == roundToNearestWhole(+teamOFDay.winRate) ? 'Correct Win Rate' : 
                    roundToNearestWhole(+guess.winRate) < roundToNearestWhole(+teamOFDay.winRate) ? 'Less than the correct Win Rate' : 
                    'Greater than the correct Win Rate'
                  }
                >
                  {guess.winRate}
                </td>
                <td
                  class={
                    guess.rlcsLans == teamOFDay.rlcsLans ? 'green' :
                    guess.rlcsLans < teamOFDay.rlcsLans ? 'less' : 
                    'greater'
                  }
                  title={
                    guess.rlcsLans == teamOFDay.rlcsLans ? 'Correct RLCS LANS' : 
                    guess.rlcsLans < teamOFDay.rlcsLans ? 'Less than the correct RLCS LANS attended' : 
                    'Greater than the correct RLCS LANS attended'
                  }
                >{guess.rlcsLans}</td>
                <td
                  class={
                    parseInt(guess.winnings.replace(/,/g, '')) == parseInt(teamOFDay.winnings.replace(/,/g, '')) ? 'green' :
                    parseInt(guess.winnings.replace(/,/g, '')) < parseInt(teamOFDay.winnings.replace(/,/g, '')) ? 'less' : 
                    'greater'
                  }
                  title={
                    parseInt(guess.winnings.replace(/,/g, '')) == parseInt(teamOFDay.winnings.replace(/,/g, '')) ? 'Correct' : 
                    parseInt(guess.winnings.replace(/,/g, '')) < parseInt(teamOFDay.winnings.replace(/,/g, '')) ? 'Less than the correct winnings' : 
                    'Greater than the correct winnings'
                  }
                >{guess.winnings}
                </td>
                <td class:green={guess.active === teamOFDay.active}
                >{guess.active==="true"? "yes":"no" }</td>
              </tr>
            {/each}
          </table>
          <div class="attemptsCount">
            {#each guessLimit as guess}
              <span class="progress" class:guessed={guess==1}></span>
            {/each}
          </div>
        {/if}

        <div bind:this={orgCard}
        class="card-container">
          <p>Mystery Organisation</p>
          <h1>{teamOfDayName}</h1>
          <a href={teamLink} target="_blank">Liquipedia Page</a>
        </div>
        <!-- add tire tracks and keep animating them! -->

        <!-- info links -->
        <div class="info">
          <a href="."  class="guide-link" on:click={(e)=> { e.preventDefault()
          gsap.to(guessrBtn, {
            x: '0',
            duration: 1,
            ease: 'power1.inOut'
          })
          }}
          on:keypress={(e)=> { e.preventDefault()
            gsap.to(guessrBtn, {
              x: '0',
              duration: 1,
              ease: 'power1.inOut'
            }) }}
          >Guessr Guide</a>
          <div class="separator"></div>
          <a href="." on:click={(e)=> { e.preventDefault()
            fetchGlobalStats()
            gsap.to(statsBtn, {
              x: '0',
              duration: 1,
              ease: 'power1.inOut'
          })
          }}
          on:keypress={(e)=> { e.preventDefault()
            fetchGlobalStats()
            gsap.to(statsBtn, {
              x: '0',
              duration: 1,
              ease: 'power1.inOut'
            }) }}
          class="stats-link">Statistics</a>
        </div>
        
      </div>
    </div>

  </div>

  <div bind:this={detailedStats} class="detailed-stats">
    <h2>Unlucky</h2>
    <div class="line"></div>
    <div class="card-container2">
      <p>Mystery Organisation</p>
      <h1>{teamOfDayName}</h1>
      <a href={teamLink} target="_blank">Liquipedia Page</a>
    </div>
    <div class="line"></div>
    <p>Try again tomorrow</p>
    <h2>{timeRemaining}</h2>
    <button 
      on:keypress={(event) => {
        if (event.key == 'Enter') {
          document.querySelector('.detailed-stats').setAttribute('style', 'display: none;')
          document.querySelector('.staticElems').classList.remove('blurred')
        }
      }} 
      on:click={() => {
        document.querySelector('.detailed-stats').setAttribute('style', 'display: none;')
        document.querySelector('.staticElems').classList.remove('blurred')
      }} 
      class="card">
      close
    </button>
  </div>

  <div bind:this={statsBtn} class="stats-card">
    <a href='.' class="arrow" on:click ={(e)=> {
      e.preventDefault()
      gsap.to(statsBtn, {
        x: '100vw',
        duration: 1,
        ease: 'power1.inOut'
      })
    }}
    on:keypress={(e)=>{ e.preventDefault()
      gsap.to(statsBtn, {
        x: '100vw',
        duration: 1,
        ease: 'power1.inOut'
      })
    }}
    >&larr;</a>
    <h2>All Time Stats</h2>
    <div class="stat-boxes">
      <h3>Your Stats</h3>
      <div class="boxes">
        <div class="box">
          <p>Games Played</p>
          <p>{gamesPl}</p>
        </div>
        <div class="box">
          <p>Games Won</p>
          <p>{gamesW}</p>
        </div>
        <div class="box">
          <p>Win %</p>
          <p>{(gamesW/gamesPl)*100}</p>
        </div>
      </div>
    </div>
    <div class="stat-boxes">
      <h3>Global Stats</h3>
      <div class="boxes">
        <div class="box">
          <p>Games Played</p>
          <p>{globalGamesPl}</p>
        </div>
        <div class="box">
          <p>Games Won</p>
          <p>{globalGamesW}</p>
        </div>
        <div class="box">
          <p>Win %</p>
          <p>{ globalGamesPl==0? 0: (globalGamesW/globalGamesPl)*100}</p>
        </div>
      </div>
    </div>
  </div>

  <div bind:this={guessrBtn} class="guessr-card">
    <a href='.' class="arrow" on:click ={(e)=> {
      e.preventDefault()
      gsap.to(guessrBtn, {
        x: '100vw',
        duration: 1,
        ease: 'power1.inOut'
      })
    }}
    on:keypress={(e)=>{ e.preventDefault()
      gsap.to(guessrBtn, {
        x: '100vw',
        duration: 1,
        ease: 'power1.inOut'
      })
    }}
    >&larr;</a>
    <h2>How to Play</h2>
    <p>6 guesses, one mystery Rocket League Esports team<br><br>A new team to guess every 24 hours</p>

    <div class="sub-info">
      <h3>Key</h3>
      <div class="table-keys">
        <div class="field-group">
          <p class="field">Empty Box</p>
          <p class="value">incorrect answer</p>
        </div>
        <div class="field-group">
          <p class="field">Green Box</p>
          <p class="value">correct answer</p>
        </div>
        <div class="field-group">
          <p class="field">Blue Box</p>
          <p class="value">lesser than correct answer</p>
        </div>
        <div class="field-group">
          <p class="field">Red Box</p>
          <p class="value">greater than correct answer</p>
        </div>
      </div>
    </div>
    <div class="sub-info">
      <h3>Team Regions</h3>
      <p>North America, South America, Oceania, Middle East & North Africa, Sub Saharan Africa, Asia-Pacific</p>
    </div>
  </div>

</main>

