const express = require("express");
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app); // create HTTP server
// const io = new Server(server);             // create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // frontend URL
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files like HTML, CSS, JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: '*', // Allow only requests from this origin
    methods: ['GET', 'POST', 'PUT'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

let id_store = []

let list_of_hosts = [
    {
        id: 'hostId1',
        name: "host Name (Optionel)",
        isHost: true,
        game_id: 123,

    },
    {
        id: 'hostId1',
        name: "host Name (Optionel)",
        isHost: true,
        game_id: 123,

    }
]

let list_of_players = [
    {
        id: 'playerId1',
        name: "Player Name ",
        joined_game_id: 123,
        ticket_id: 'Generated_Ticket_Id'
    },
    {
        id: 'playerId1',
        name: "Player Name ",
        joined_game_id: 123,
        ticket_id: 'Generated_Ticket_Id'
    }
]

let list_of_all_games = [
    {
        id: '123',
        hostId: 'hostID',
        playersId: [123, 123, 123],
        status: 'Created',
        callNumberList: [],
        rools: []

    },
    {
        id: '1234',
        hostId: 'hostID',
        playersId: [123, 123, 123],
        status: 'Created',
        callNumberList: [],
        rools: [
            {
                id: 5385,
                name: "First 7",
                isChecked: true,

                winnerId: 22,
                wName: 'vamshi',
                isCompleated: false
            }
        ]

    },
]

let list_of_all_tickets = Array()

let types_of_wins = [
    {
        id: get_unique_id(),
        name: "Row 1",
        isChecked: true
    },
    {
        id: get_unique_id(),
        name: "Row 2",
        isChecked: true
    },
    {
        id: get_unique_id(),
        name: "Row 3",
        isChecked: true
    },
    {
        id: get_unique_id(),
        name: "Full House",
        isChecked: true
    },
    {
        id: get_unique_id(),
        name: "First 5",
        isChecked: false
    },
    {
        id: get_unique_id(),
        name: "First 7",
        isChecked: false
    },
]

function changeGameStatus(gameId, status) {
    let list = list_of_all_games.filter(item => String(item.id) === String(gameId))[0]
    list.status = status
}

function calling_randome_numbers() {
    min = Math.ceil(1);
    max = Math.floor(99);
    return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
}

function get_unique_id() {

    const ramdom_num = () => Math.floor(Math.random() * 1000000)
    let num = ramdom_num()
    let n = 0;

    while (true) {
        n = n + 1
        if (!id_store.includes(num)) {
            id_store.push(num)
            return num
        } else {
            num = ramdom_num()
        }
        if (n > 1000000) {
            break
        }
    }

}

function call_number(gameId, num) {
    let number = num!== undefined?num:calling_randome_numbers()

    console.log("BuG Called Num = ",num)

    let list = list_of_all_games.filter(item => String(item.id) === String(gameId))[0]

    let gameIndex = list_of_all_games.indexOf(list)

    while (true) {
        if (!list.callNumberList.includes(number)) {
            list_of_all_games[gameIndex].callNumberList.push(number)
            // display_called_numbers(called_numbers_list.reverse())
            break
        } else if (String(list_of_all_games[gameIndex].callNumberList.length) === '99') {
            return 0
        } else {
            number = calling_randome_numbers()
        }

    }
    const d = list_of_all_games[gameIndex].callNumberList
    return d
}

function createGame(hostId) {

    function randome_numbers_generator_inner(min_num, max_num) {
        min = Math.ceil(min_num);
        max = Math.floor(max_num);
        return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
    }

    function get_unique_id_inner() {

        const ramdom_num = () => randome_numbers_generator_inner(100000, 100000000)
        let num = ramdom_num()

        while (true) {
            if (!id_store.includes(num)) {
                id_store.push(num)
                return num
            } else {
                num = ramdom_num()
            }
        }

    }

    let newGame = {
        id: get_unique_id_inner(),
        hostId,
        status: 'created',
        callNumberList: [],
        rools: []

    }
    list_of_all_games.push(newGame)

    return newGame.id
}

function ticket_generator() {
    // const ticket_ID = 'ticketId.' + get_unique_id()
    const ticket_ID = get_unique_id()

    let ticket = { id: ticket_ID, };
    let ticket_numbers;
    let ticket_numbers_potions = []
    let ticket_values = []

    // Helper function to get random numbers
    function randome_numbers_generator(min_num, max_num) {
        min = Math.ceil(min_num);
        max = Math.floor(max_num);
        return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
    }

    // Generates 15 unique numbers for the ticket
    function ticket_numbers_generator() {
        let numbers = []

        for (let ii = 1; ii <= 15; ii++) {
            let num = randome_numbers_generator(1, 99)
            while (true) {
                if (!numbers.includes(num)) {
                    numbers.push(num)
                    break
                } else {
                    num = randome_numbers_generator(1, 99)
                }
            }
        }
        return numbers
    }

    ticket_numbers = ticket_numbers_generator()

    // Generates 5*3 unique, sorted positions (0-8) for a single row
    function random_ticket_number_postion_generator() {
        let rr = []
        for (let j = 0; j < 3; j++) {
            let arry_postions = []

            for (let i = 0; i < 5; i++) {
                let num = randome_numbers_generator(0, 8)
                while (true) {
                    if (!arry_postions.includes(num)) {
                        arry_postions.push(num)
                        break
                    } else {
                        num = randome_numbers_generator(0, 8)
                    }
                }
            }
            rr.push(arry_postions.sort())
        }
        return rr
    }

    ticket_numbers_potions = random_ticket_number_postion_generator()

    //Build the 3x9 grid => full ticket with respective values in it 
    for (let f = 0; f < 3; f++) {
        let incr_num = 0
        let arr_row = []

        for (let ff = 0; ff < 9; ff++) {
            let item = {}
            if (ff == ticket_numbers_potions[f][incr_num]) {
                incr_num = incr_num + 1
                item = {
                    id: get_unique_id(),
                    num: ticket_numbers.pop(),
                    isChecked: false
                }

            } else {
                item = {
                    id: get_unique_id(),
                    num: 0,
                    isChecked: true
                }
            }
            arr_row.push(item)
        }

        ticket_values.push(arr_row)
    }

    ticket.value = ticket_values
    list_of_all_tickets.push(ticket)

    return ticket_ID
}

// ---------- HTML Routes ----------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'player.html')));
app.get('/bug', (req, res) => res.sendFile(path.join(__dirname, 'public', 'bug.html')));
app.get('/js', (req, res) => res.sendFile(path.join(__dirname, 'public', 'js/player.js')));
app.get('/css', (req, res) => res.sendFile(path.join(__dirname, 'public', 'css/styles.css')));

// This API Not IN Use ❌
app.get('/create/host/:name', (req, res) => {

    const { name } = req.params
    const hsotID = get_unique_id()

    let newHost = {
        // id: 'hostId.' + get_unique_id(),
        id: hsotID,
        socketId: socket.id,
        name: name,
        role: 'host',
        isHost: true,
        game_id: createGame(hsotID),
    }

    list_of_hosts.push(newHost)

    res.status(200).json({ data: newHost, message: "Host and Game created Successfull", types_of_wins })

});

// This API Not IN Use ❌
app.get('/create/player/:name', (req, res) => {
    const { name } = req.params

    let newPlayer = {
        // id: 'playerId.' + get_unique_id(),
        id: get_unique_id(),
        socketId: socket.id,
        name: name,
        role: 'player',
        joined_game_id: 123,
        ticket_id: ticket_generator()
    }

    list_of_players.push(newPlayer)

    res.status(200).json({ data: newPlayer, message: "PLayer created Successfull" })

});

// This API Not IN Use ❌
app.post('/update/ticket', (req, res) => {
    const { ticketId, row_index, item_index } = req.body
    console.log(row_index, item_index)

    const ticket_ = list_of_all_tickets.filter(i => String(i.id) === String(ticketId))[0]
    const ticket_index = list_of_all_tickets.indexOf(ticket_)

    list_of_all_tickets[ticket_index].value[row_index][item_index].isChecked = true

    console.log('=> |||||| : ', list_of_all_tickets[ticket_index].value[row_index][item_index])
})

// Send Ticket To Player ✔️
app.get('/get/ticket/:ticketID', (req, res) => {
    const { ticketID } = req.params

    const ticket = list_of_all_tickets.filter(item => String(item.id) === String(ticketID))[0]

    // list_of_players.push(newPlayer)

    res.status(200).json({ ticket: ticket, message: "ticket", list_of_all_tickets })

});

app.get('/get/all/games', (req, res) => {
    res.status(200).json(list_of_all_games)

});
app.get('/get/all/players', (req, res) => {
    res.status(200).json(list_of_players)

});
app.get('/get/all/tickets', (req, res) => {
    res.status(200).json(list_of_all_tickets)

});
app.get('/get/all/host', (req, res) => {
    res.status(200).json(list_of_hosts)

});

app.get('/get/all/ids', (req, res) => {
    res.status(200).json(id_store)

});

app.get('/get/all/all', (req, res) => {
    res.status(200).json({all:{id_store,list_of_hosts,list_of_players,list_of_all_games,list_of_all_tickets,}})

});

app.get('/get/any/with/request/:listName',(req,res)=>{
    const { listName } = req.params

    res.status(200).json(listName)

})






// Client connects
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Host joins room
    socket.on('hostJoin', ({ name }) => {

        const hostId = get_unique_id()
        const gameId = createGame(hostId)

        let newHost = {
            // id: 'hostId.' + get_unique_id(),
            id: hostId,
            socketId: socket.id,
            name: name,
            role: 'host',
            isHost: true,
            game_id: gameId,
        }

        list_of_hosts.push(newHost)

        socket.join(`game-${gameId}`);

        io.to(newHost.socketId).emit('hostJoined', { newHost, types_of_wins })

        console.log(`Host (${hostId}) joined game-${gameId}`);
    });

    // Create New Player 
    socket.on('playerJoin', ({ name }) => {

        let newPlayer = {
            // id: 'playerId.' + get_unique_id(),
            id: get_unique_id(),
            socketId: socket.id,
            name: name,
            role: 'player',
            joined_game_id: 123,
            ticket_id: ticket_generator()
        }

        list_of_players.push(newPlayer)

        io.to(newPlayer.socketId).emit('playerJoined', newPlayer)

        console.table('Players List')
        console.table(list_of_players)
    });

    // Join game (player or host)
    socket.on('joinGame', ({ id, name, gameId }) => {
        const game_ = list_of_all_games.filter(g => String(g.id) === String(gameId))[0];

        console.log('=> game : ', game_)

        if (game_ !== undefined) {
            if (game_.status === 'created') {
                socket.join(`game-${gameId}`);

                list_of_players.filter(item => {
                    if (item.id == id) {
                        list_of_players[list_of_players.indexOf(item)].joined_game_id = gameId;
                    }
                });

                // Update joined players list
                const joinedPlayers = list_of_players.filter(p => p.joined_game_id === gameId);

                // ✅ Send to everyone in this room (players + host)
                io.to(`game-${gameId}`).emit('playersList', joinedPlayers);

                // Personal message
                socket.emit('personalNotification', `Welcome ${name} to Game ${gameId}`);
            } else {
                socket.emit('personalNotification', `Ohh! Game alredy started con't join`);
            }
        } else {
            socket.emit('personalNotification', ` Ohh! Game alredy started con't join`);
        }
    });

    // Start game for a particular game room
    socket.on('startGame', ({ gameId, tempRoolsList }) => {

        changeGameStatus(gameId, "started")
        let list = list_of_all_games.filter(item => String(item.id) === String(gameId))[0]
        console.table(list_of_all_games)

        const ind = list_of_all_games.indexOf(list)

        let updatedRoolsList = []

        for (let q of tempRoolsList) {
            let ob = {
                ...q,
                winnerId: '',
                wName: '',
                isCompleated: false

            }
            updatedRoolsList.push(ob)
        }

        list_of_all_games[ind].rools = updatedRoolsList

        // Notify all players in this game that the game has started
        io.to(`game-${gameId}`).emit('gameStarted', { message: 'The game has begun!', updatedRoolsList });
    });

    // Host sends call numbers to players
    socket.on('callNumber', ({ gameId, num }) => {

        const list = list_of_all_games.filter(item => String(item.id) === String(gameId))[0]
        
        if (list.status === 'started') {
            io.to(`game-${gameId}`).emit('callNotification', call_number(gameId, num));
        } else {
            io.to(`game-${gameId}`).emit('callNotificationNotStarted', "Game Not Yet Started.");
        }
    });

    // Update Ticket Number as Checked (true)
    socket.on('updateTicket', ({ player, row_index, item_index, ticketNumHTMLEleId }) => {
        const { ticket_id} = player

        const ticketId = ticket_id

        const ticket_ = list_of_all_tickets.filter(i => String(i.id) === String(ticketId))[0]
        const ticket_index = list_of_all_tickets.indexOf(ticket_)

        list_of_all_tickets[ticket_index].value[row_index][item_index].isChecked = true

        if(list_of_all_tickets[ticket_index].value[row_index][item_index].isChecked){
            io.to(player.socketId).emit("ticketNumCheck",{ticketNumHTMLEleId})
        }else{
            io.to(player.socketId).emit("ErrorInTicketNumCheck",{message:'Error In Checking Number From Server'})
        }

    })
    
    // Under maintanence 🛠️🚧🛠❌
    socket.on('winReqFromPlayer', ({ id, name, joined_game_id, ticket_id }) => {
        const req = {}

        const host = list_of_hosts.filter(h => String(h.game_id) === String(joined_game_id))[0]

    })

    // Validate player is winer or not in any one of rools
    socket.on('validateAndClimeWinner', ({ player, i }) => {

        const game = list_of_all_games.filter(g => String(g.id) === String(player.joined_game_id))[0]
        const gameIndex = list_of_all_games.indexOf(game)

        const rool = game.rools.filter(g => String(g.id) === String(i.id))[0]
        const rooIndex = game.rools.indexOf(rool)

        function validateWinner(player, rool) {
            const { ticket_id } = player
            const { name } = rool
            const ticket = list_of_all_tickets.filter(t => String(t.id) === String(ticket_id))[0]
            const ticketIndex = list_of_all_tickets.indexOf(ticket)
            let playerRequestedIndex = ''

            switch (name) {
                case 'Row 1':
                    playerRequestedIndex = 0;
                    break;
                case 'Row 2':
                    playerRequestedIndex = 1;
                    break;
                case 'Row 3':
                    playerRequestedIndex = 2;
                    break;
                case 'Full House':
                    playerRequestedIndex = 'all';
                    break;
                case 'First 5':
                    playerRequestedIndex = 'f5';
                    break;
                case 'First 7':
                    playerRequestedIndex = 'f7';
                    break;
                default:
                    console.log(`Error in name value => ${name}`)

            }

            if (typeof (playerRequestedIndex) === 'number') {
                const ticketRowIndex = playerRequestedIndex

                const row = ticket.value[ticketRowIndex]

                const isValid = row.every(i => String(i.isChecked) === 'true')

                return isValid
            } else {

                if (playerRequestedIndex === 'all') {
                    const temp_ = []

                    for (let tr of ticket.value) {

                        const isValid = tr.every(i => String(i.isChecked) === 'true')
                        temp_.push(isValid)

                    }

                    return temp_.every(i => i)

                } else if (playerRequestedIndex === 'f5') {

                    const emptyBoxCount = 12 + 5
                    const temp_ = []

                    for (let trr of ticket.value) {

                        const isValid = trr.filter(i => String(i.isChecked) === 'true')
                        temp_.push(...isValid)
                    }

                    return temp_.length >= emptyBoxCount

                } else if (playerRequestedIndex === 'f7') {

                    const emptyBoxCount = 12 + 7
                    const temp_ = []

                    for (let trrr of ticket.value) {

                        const isValid = trrr.filter(i => String(i.isChecked) === 'true')
                        temp_.push(...isValid)
                    }

                    return temp_.length >= emptyBoxCount

                }
                return false

            }

        }

        if (!list_of_all_games[gameIndex].rools[rooIndex].isCompleated) {

            // Hear validate Ticket 

            isValid = validateWinner(player, i)

            if (isValid) {

                list_of_all_games[gameIndex].rools[rooIndex].isCompleated = true
                list_of_all_games[gameIndex].rools[rooIndex].wName = player.name
                list_of_all_games[gameIndex].rools[rooIndex].winnerId = player.id
                
                let roolName = list_of_all_games[gameIndex].rools[rooIndex].name

                if(roolName === 'Full House'){
                    //send full house winner and game also end

                    io.to(`game-${player.joined_game_id}`).emit('GameCompleated', player)
                }

                const list = list_of_all_games[gameIndex].rools
                io.to(`game-${player.joined_game_id}`).emit('revisedWinnerList', { list })
            } else {
                io.to(player.socketId).emit('NotValidError', { message: 'You are not Done', id: i.id })
            }
        } else {
            io.to(player.socketId).emit('NotValidError', { message: 'This already claimed', id: false })
        }

    })

    // End the Game
    socket.on('gameEnd', ({ gameId }) => {
        changeGameStatus(gameId, "ended")
        console.log(list_of_all_games)

        io.to(`game-${gameId}`).emit('gameEnded', { message: 'The game has ended by the Host' })
    })

    // If Player Left The Remove Player Form Joined Game and Update Plyears and Host UI
    socket.on('playerLeft', ({ id, gameId }) => {
        console.log(`Player ${id} left game ${gameId}`);

        // Remove that player from the game’s list
        list_of_players = list_of_players.filter(p => !(p.id === id && p.joined_game_id === gameId));

        // Get updated list of remaining players
        const joinedPlayers = list_of_players.filter(p => p.joined_game_id === gameId);

        // Send updated list to all players (and host) in that game
        io.to(`game-${gameId}`).emit('playersList', joinedPlayers);


        // Optional: notify others
        // io.to(`game-${gameId}`).emit('playerLeftNotification', { id });
    });


});


const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});