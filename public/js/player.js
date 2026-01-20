const socket = io(); // connect to server

let player    // player or Host Details
let tempRoolsList_sample = [
    {
        id: 123,
        name: "Row 1",
        isChecked: true
    },
    {
        id: 123,
        name: "Row 2",
        isChecked: true
    },
    {
        id: 123,
        name: "Row 3",
        isChecked: true
    },
    {
        id: 123,
        name: "Full House",
        isChecked: true
    },
    {
        id: 123,
        name: "First 5",
        isChecked: false
    },
]

let tempRoolsList = []
let roolsListHost = []

var called_numbers_list = []

let intervalID

const gameEntrySection = document.getElementById('gameEntrySection')
const joinAsHostSection = document.getElementById('joinAsHostSection')
const joinAsPlayerSection = document.getElementById('joinAsPlayerSection')


function socketStatusManager() {
  const el = document.getElementById("socketStatus");
  const socket = io();

  let pingInterval = null;
  let lastPingTime = 0;

  Object.assign(el.style, {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "white",
    fontWeight: "600",
    width: "fit-content",
    background: "red"
  });

  function signalBars(ms) {
    if (ms < 50) return "📶📶📶📶";
    if (ms < 100) return "📶📶📶";
    if (ms < 200) return "📶📶";
    return "📶";
  }

  function startPing() {
    pingInterval = setInterval(() => {
      lastPingTime = Date.now();
      socket.emit("client-ping");
    }, 2000);
  }

  function stopPing() {
    clearInterval(pingInterval);
    pingInterval = null;
  }

  socket.on("server-pong", () => {
    const latency = Date.now() - lastPingTime;
    el.textContent = `🟢Connected ${signalBars(latency)}`;
  });

  socket.on("connect", () => {
    el.style.background = "green";
    el.textContent = "🟢 Connecting…";
    startPing();
  });

  socket.on("disconnect", () => {
    el.style.background = "red";
    el.textContent = "🔴 Offline";
    stopPing();
  });

  socket.io.on("reconnect_attempt", () => {
    el.style.background = "orange";
    el.textContent = "🟡 Reconnecting";
  });
}






















const spinner = () => {
    const s = document.createElement('div')
    s.classList.add('spinner')
    return s
}

function setIntervalForCallNum() {

    const s = parseInt(document.getElementById('interwellTime').value) * 1000
    intervalID = setInterval(function () {
        document.getElementById('callNumBtn').click()
    }, s)

    document.getElementById('clearIntervalBtn').classList.remove('d-none')
    document.getElementById('setIntervalBtn').classList.add('d-none')

}

function clearIntervalForCallNum() {
    clearInterval(intervalID)
    document.getElementById('clearIntervalBtn').classList.add('d-none')
    document.getElementById('setIntervalBtn').classList.remove('d-none')


}

function hostPageLoad() {
    const { game_id, name, id } = player
    console.table(player)
    console.log(typeof (player))
    console.log(player)

    document.getElementById('dispHostName').textContent = name
    document.getElementById('dispGameId').textContent = game_id
}

function joinAsHost() {
    const name = document.getElementById("name").value

    if (name !== '') {
        joinAsHostSection.classList.remove('d-none')
        joinAsPlayerSection.classList.add('d-none')
        gameEntrySection.classList.add('d-none')

        socket.emit('hostJoin', { name })

    } else {
        const win = confirm("Is Your Name 'Null' ? ");
        if (!win) {
            alert('Then Enter Your Name')
        }
    }



    // fetch(`/create/host/${name}`, {
    //     method: 'GET',
    //     'Content-Type': 'application/json'
    // })
    //     .then(data => data.json())
    //     .then(data => {
    //         console.log(data)
    //         player = data.data
    //         console.table(data.types_of_wins)

    //         hostPageLoad()
    //         // alert(data.message)
    //     })
}

function joinAsPlayer() {
    const name = document.getElementById("name").value

    if (name !== '') {
        joinAsPlayerSection.classList.remove('d-none')
        joinAsHostSection.classList.add('d-none')
        gameEntrySection.classList.add('d-none')


        socket.emit('playerJoin', { name })

    } else {
        const win = confirm("Is Your Name 'Null' ? ");
        if (!win) {
            alert('Then Enter Your Name')
        }
    }






    // fetch(`/create/player/${name}`, {
    //     method: 'GET',
    //     'Content-Type': 'application/json'
    // })
    //     .then(data => data.json())
    //     .then(data => {
    //         console.log(data)
    //         player = data.data

    //         alert(data.message)
    //     })
}

function jonedGame() {

    document.getElementById('showGameID').textContent = player.joined_game_id
    socket.emit('winReqFromPlayer', { ...player })
    document.getElementById('displayGame').classList.remove('d-none')
    document.getElementById('readGameIdSection').classList.add('d-none')
}

function joinGame() {
    const gameId = document.getElementById("readGameId").value
    console.log(gameId)
    if (gameId !== '') {
        player.joined_game_id = gameId
        socket.emit('joinGame', { ...player, gameId });
    } else {
        alert('Where is Game ID ????')
    }
}

function showTicket() {

    const displayTickets = document.getElementById('displayTickets')

    // Display Ticket
    function display_ticket(ticket) {

        console.log('=> ticket: ', ticket)
        function ticket_row(row) {
            console.table(row)

            const ticketRow = document.createElement('tr')
            ticketRow.classList.add('disply-ticket-table-body-row')

            function ticket_number_box(item) {
                let num = item.num
                if (num === 0) {
                    num = ''
                }
                const number = document.createElement('td')
                number.id = item.id
                number.classList.add('cursor-pointer')
                number.textContent = num

                if (item.isChecked) {
                    // number.classList.add('check-ticket-num')
                    number.classList.remove('cursor-pointer')
                }

                number.onclick = function () {

                    function changeIsCheckedStatus(id) {
                        for (let row of ticket) {
                            let row_index = ticket.indexOf(row)
                            for (let item of row) {
                                if (item.id === id && item.isChecked === false) {
                                    // if (item.id === id && item.isChecked === false) {
                                    let item_index = ticket[row_index].indexOf(item)
                                    console.log(row_index, item_index)
                                    // list_of_all_tickets[0].value[row_index][item_index].isChecked = true


                                    // document.getElementById(id).classList.add('isChecked')

                                    const data = {
                                        ticketId: player.ticket_id,
                                        row_index,
                                        item_index,
                                    }


                                    socket.emit('updateTicket', {
                                        player, row_index,
                                        item_index,
                                        ticketNumHTMLEleId: id,
                                    })

                                    // let options = {
                                    //     method: "POST",
                                    //     headers: {
                                    //         "Content-Type": "application/json",
                                    //         // Authorization: "Bearer " + jwtToken
                                    //     },
                                    //     body: JSON.stringify(data)
                                    // };

                                    // fetch('/update/ticket', options)
                                    //     .then(function (response) {
                                    //         return response.json();
                                    //     })
                                    //     .then(function (jsonData) {
                                    //         document.getElementById(id).classList.add('isChecked')

                                    //         console.log(jsonData.message)
                                    //     })
                                    //     .catch(error => {
                                    //         console.log("err : ", error)
                                    //     })
                                }
                            }
                        }
                        // console.log(list_of_all_tickets)
                    }
                    if (String(num) !== '') {
                        if (called_numbers_list.includes(num)) {

                            changeIsCheckedStatus(item.id)
                        }

                    }

                }
                return number
            }

            for (let item of row) {
                ticketRow.appendChild(ticket_number_box(item))
            }
            return ticketRow
        }
        for (let row of ticket) {
            displayTickets.appendChild(ticket_row(row))
        }
    }


    console.log(player.ticket_id)
    fetch(`/get/ticket/${player.ticket_id}`, {
        method: 'GET',
        'Content-Type': 'application/json'
    })
        .then(data => data.json())
        .then(data => {
            let t = data.ticket
            console.log(t)
            console.log(t.value)
            document.getElementById('displayTicketID').textContent = t.id
            display_ticket(t.value)
            showTicketBtn.classList.add('d-none')
            // console.log('=> list_of_all_tickets : ' + JSON.stringify(t, null, 0))
            // alert(data.message)
        })


}

function display_called_numbers(perentDiv, list) {
    const numList = [...list].reverse()
    perentDiv.innerHTML = "";

    function create_num_ele(item) {
        const num_ele = document.createElement('div')
        num_ele.textContent = item
        if (numList.indexOf(item) === 0) {
            num_ele.classList.add('last-called-num')
        }

        return num_ele
    }

    for (let num_item of numList) {
        perentDiv.appendChild(create_num_ele(num_item))
    }
}

function display_joined_players_list(perentDiv, numList) {

    perentDiv.innerHTML = "";
    function create_num_ele(item) {
        const tRow = document.createElement('tr')
        tRow.classList.add('joined-players-table-body-row')

        const idEle = document.createElement('td')
        idEle.textContent = item.id
        tRow.appendChild(idEle)

        const nameEle = document.createElement('td')
        nameEle.textContent = item.name
        tRow.appendChild(nameEle)

        return tRow
    }

    for (let num_item of numList) {
        perentDiv.appendChild(create_num_ele(num_item))
    }
}

function callNumbersHost(btn) {
    const { game_id } = player
    const gameId = game_id
    socket.emit('callNumber', { gameId })

    btn.innerHTML = ''
    btn.appendChild(spinner())
}

function startGameHost(btn) {

    const { game_id } = player
    const gameId = game_id
    socket.emit('startGame', { gameId, tempRoolsList })

    btn.innerHTML = ''
    btn.appendChild(spinner())
    btn.classList.add('d-none')
    document.getElementById('toglleCallNumberAndEndGameBtns').classList.remove('d-none')
    document.getElementById('diplayCalledNumContainer').classList.remove('d-none')
    document.getElementById('displayWinnersMain').classList.remove('d-none')
}

function endGameHost() {
    const { game_id } = player
    const gameId = game_id
    socket.emit('gameEnd', { gameId })
}

function validatePlayerTicket(i) {
    console.log(i)
    i.innerHTML = ''
    i.appendChild(spinner())
    const p = i.parentElement

    // socket.emit('winReqFromPlayer',{...player})

}

function showGameRoolsHost(roolsList) {

    const gameRoolsDisply = document.getElementById('gameRoolsDisplyCard')

    function rool(item) {

        const c = document.createElement('div')
        c.classList.add('card')


        const input = document.createElement('input')
        input.id = item.id
        input.type = 'checkbox'
        input.checked = item.isChecked
        input.onclick = function () {
            item.isChecked = !item.isChecked

            if (item.isChecked && !tempRoolsList.includes(item)) {
                tempRoolsList.push(item)
            } else {
                const index_ = tempRoolsList.indexOf(item)
                tempRoolsList.splice(index_, 1)
            }
            console.log(tempRoolsList)
        }
        c.appendChild(input)

        const label = document.createElement('label')
        label.textContent = item.name
        label.htmlFor = item.id
        c.appendChild(label)

        return c
    }

    for (let item of roolsList) {
        console.log(item)
        gameRoolsDisply.appendChild(rool(item))
    }


}

function displayGameRools(perent, list) {

    const winnersCount = list.filter(r => r.isCompleated).length

    const countOfWinnersHost = document.getElementById('countOfWinnersHost')
    countOfWinnersHost.textContent = winnersCount + '/' + list.length

    const countOfWinners = document.getElementById('countOfWinners')
    countOfWinners.textContent = winnersCount + '/' + list.length

    for (let p of list) {
        const tbRow = document.createElement('tr')
        tbRow.classList.add('winners-table-body-row')
        tbRow.id = p.id

        function createTD(i) {

            const tbData1 = document.createElement('td')
            tbData1.textContent = i.name
            tbRow.appendChild(tbData1)

            const tbData2 = document.createElement('td')
            tbData2.id = i.id



            if (String(player.role) === 'player') {
                if (i.isCompleated) {
                    // const tbData2 = document.createElement('td')
                    tbData2.textContent = i.wName
                    tbRow.appendChild(tbData2)
                } else {

                    // const tbData2 = document.createElement('td')

                    const btn = document.createElement('button')
                    btn.classList.add('winners-table-clime-btn')
                    btn.id = "climeBTN#" + i.id
                    btn.addEventListener('click', function () {
                        console.log("cLimed")
                        console.log(player)

                        btn.innerHTML = ''
                        btn.appendChild(spinner())
                        socket.emit('validateAndClimeWinner', { player, i })
                    })
                    btn.textContent = 'Click to clime win'
                    tbData2.appendChild(btn)
                    tbRow.appendChild(tbData2)
                }
            } else {
                // const tbData2 = document.createElement('td')
                tbData2.textContent = i.wName
                tbRow.appendChild(tbData2)

            }


            return tbRow
        }

        perent.appendChild(createTD(p))
    }

}



// Sockets => connections to server <=======================> server connections <=====================================================================================


// Receive updated players list
socket.on('hostJoined', ({ newHost, types_of_wins }) => {
    player = newHost
    console.table(newHost)
    console.table(types_of_wins)
    hostPageLoad()

    tempRoolsList.push(...types_of_wins.filter(i => i.isChecked))
    console.table(tempRoolsList)

    showGameRoolsHost(types_of_wins)

});

// Listen for players joine
socket.on('playerJoined', (newPlayer) => {
    player = newPlayer
    document.getElementById('displyPlayerName').textContent = player.name
    document.getElementById('displyPlayerId').textContent = player.id

    console.table(player)


});

// Listen for players list
socket.on('playersList', (players) => {
    console.log('Players in this game:', players);
    // alert("players", players)
    if (String(player.role) === 'host') {

        if (players.length >= 2) {
            document.getElementById('startGameHostBtn').classList.remove('d-none')
        }

        const joinedPlayersListForHost = document.getElementById("joinedPlayersListForHost")
        document.getElementById('displyCountOfAllPlayersHost').textContent = players.length
        display_joined_players_list(joinedPlayersListForHost, players)
        document.getElementById('waitingForPlayersText').classList.add('d-none')

    } else {
        jonedGame()
        document.getElementById('joinedPlayersCount').textContent = players.length
    }

});

// Receive personal notifications
socket.on('personalNotification', (msg) => {
    console.log('Notification for me:', msg);
    alert(msg);
});

// Call number notifications
socket.on('callNotification', (numberList) => {
    // display_called_numbers(numberList)

    if (String(numberList) !== '0') {
        called_numbers_list = numberList

        if (String(player.role) === 'host') {
            document.getElementById("callNumBtn").innerHTML = 'Call Number'

            const calledNumbersListForHost = document.getElementById("calledNumbersListForHost")
            calledNumbersListForHost.classList.remove('d-none')
            display_called_numbers(calledNumbersListForHost, numberList)
        } else {
            const calledNumbersList = document.getElementById("calledNumbersList")
            calledNumbersList.classList.remove('d-none')
            display_called_numbers(calledNumbersList, numberList)
        }
    } else {
        if (intervalID) {
            clearIntervalForCallNum()
        }
        alert('Call number limit Exceed.')
        document.getElementById('callNumBtn').classList.add('d-none')
    }

});

// Error messege
socket.on('callNotificationNotStarted', (message) => {
    alert(message)
    alert('Start Game First')
    document.getElementById("callNumBtn").innerHTML = 'Call Number'

});

// Listen for game start
socket.on('gameStarted', ({ message, updatedRoolsList }) => {

    if (player.role === 'player') {
        document.getElementById('showTicketBtn').click()
        document.getElementById('ticketAndCalledNumDivToggle').classList.remove('d-none')
        document.getElementById('loading1').classList.add("d-none")
        const displyWinnerReqsTable = document.getElementById('displyWinnerReqsTable')
        displayGameRools(displyWinnerReqsTable, updatedRoolsList)

    } else {
        const displyWinnerReqsTableHost = document.getElementById('displyWinnerReqsTableHost')
        const gameRoolsHeading = document.getElementById('gameRoolsHeading')
        const gameRoolsDisply = document.getElementById('gameRoolsDisply')
        gameRoolsDisply.classList.add('d-none')
        gameRoolsHeading.textContent = 'Game Rolls'
        document.getElementById("startGameHostBtn").innerHTML = "Start Game"
        console.table(updatedRoolsList)
        displayGameRools(displyWinnerReqsTableHost, updatedRoolsList)
        document.getElementById('displyWinnerReqsTableHost').classList.remove('d-none')



    }

    alert(message); // update UI or show notification
});

// Listen for updated winner list
socket.on('revisedWinnerList', ({ list }) => {

    if (player.role === 'player') {
        const displyWinnerReqsTable = document.getElementById('displyWinnerReqsTable')
        displyWinnerReqsTable.innerHTML = ''
        displayGameRools(displyWinnerReqsTable, list)
    } else {
        const displyWinnerReqsTableHost = document.getElementById('displyWinnerReqsTableHost')
        displyWinnerReqsTableHost.innerHTML = ''
        displayGameRools(displyWinnerReqsTableHost, list)

    }

    // const isGameCompleated = 


})

socket.on('GameCompleated', player => {
    console.log('>>>>>winner : ', player)


    document.getElementById('houseWinnerName').textContent = player.name
    document.getElementById('houseWinnerCard').classList.remove('d-none')
})

// Error messge for claime win not valid
socket.on('NotValidError', ({ message, id }) => {

    alert(message)
    if (id) {
        const btn = document.getElementById('climeBTN#' + id)
        btn.innerHTML = ''
        btn.textContent = 'Click to clime win'
    }
});

socket.on('ticketNumCheck', ({ ticketNumHTMLEleId }) => {
    document.getElementById(ticketNumHTMLEleId).classList.add('check-ticket-num')
})

socket.on('ErrorInTicketNumCheck', ({ message }) => {
    alert(message)
})

// Listen for server instruction to load a page
socket.on('gameEnded', ({ message }) => {

    alert(message)
    window.location.reload()
});

// Player exsit messege sent to server
window.addEventListener('unload', () => {
    const { id, joined_game_id } = player
    alert('You Left the game')
    socket.emit('playerLeft', {
        id: id,       // your player's id
        gameId: joined_game_id // current game id
    });
});




// Example: host triggering a call number
// if role === 'host'
// socket.emit('callNumber', { gameId, number: 5 });
