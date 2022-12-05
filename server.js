let fs = require('fs');

let express = require("express");
let app = express();


let cors = require('cors');
app.use(cors(
{
	origin: /p5js\.org$/,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, letious SmartTVs) choke on 204
}
));

let Datastore = require("nedb");

let db = new Datastore("course.db");
let db2 = new Datastore("poll.db");

let courseList = ["Algorithms","Data Structures","Calculus","Markets","Connections Lab","Linear Algebra","Intro to CS","Math-1000","Intro to Logic","Discrete Math","FYWS","Mutivariable Calculus","Data and Society","Data Analysis","Computer Networks","Operating Systems","Computer System Organization"];

db.loadDatabase();
db2.loadDatabase();

app.use('/', express.static('public'));


let http = require("http");


let options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };



let server = http.createServer(app);

server.listen( 3000 , ()=> {
    console.log('listening');
});


let io = require("socket.io");
io = new io.Server(server);

/*
This server simply keeps track of the peers all in one big "room"
and relays signal messages back and forth.
*/
let rooms = {};
//let peers = [];



app.get('/courses', (req,res)=>{
    res.json({courseArray : courseList });
});


app.get('/comments', (req,res)=>{
    
    let c = req.query.selectedCourse;

    db.find({courseName : c}).sort({ updateAt: 1 }).exec(function (err, docs) {
        if(err) {
            res.json({task: "task failed"})
        } 
        else {
            let obj = {comments: docs};
            res.json(obj);
        }
      });

});


app.get('/polls', (req,res)=> {

    let c = req.query.selectedCourse;
    db2.find({courseName : c}).sort({ updateAt: 1 }).exec(function (err, docs) {
        if(err) {
            res.json({task: "task failed"})
        } 
        else {
            let obj = {poll : docs};
            res.json(obj);
            console.log(obj)
        }
        });
});

io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);
    
    socket.on('data', (data)=>{     // Listening for comment data values

        console.log(data);
        db.insert(data, (err, newDoc)=>{
            console.log(newDoc);
            console.log(err);
        });

        io.sockets.emit('sdata',data);
    })


    socket.on('poll', (polldata)=>{ // Listening for poll values

        console.log(polldata);
        db2.insert(polldata, (err, newDoc)=>{
            if(err)
            {
                console.log(err.message);
            }
            //console.log(newDoc);
        });

        io.sockets.emit('polldata',polldata);   
    })

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });

});


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connect',(socket) => {

    console.log(Date.now(), socket.id, "New client");
    // peers.push({socket: socket});

    socket.on('room_connect', (room) => {
        console.log(Date.now(), socket.id, room, 'room_connect');

        if (!rooms.hasOwnProperty(room)) {
            console.log(Date.now(), socket.id, "room doesn't exist, creating it");
            rooms[room] = [];
        }
        rooms[room].push(socket);
        socket.room = room;

        console.log(Date.now(), socket.id, rooms);

        let ids = [];
        for (let i = 0; i < rooms[socket.room].length; i++) {
            ids.push(rooms[socket.room][i].id);
        }
        console.log(Date.now(), socket.id, "ids length: " + ids.length);
        socket.emit('listresults', ids);
    });

    socket.on('list', () => {
        let ids = [];
        for (let i = 0; i < rooms[socket.room].length; i++) {
            ids.push(rooms[socket.room][i].id);
        }
        console.log(Date.now(), socket.id, "ids length: " + ids.length);
        socket.emit('listresults', ids);
    });

    // Relay signals back and forth
    socket.on('signal', (to, from, data) => {
        //console.log("SIGNAL", to, data);
        let found = false;
        for (let i = 0; i < rooms[socket.room].length; i++) {
            //console.log(rooms[socket.room][i].id, to);
            if (rooms[socket.room][i].id == to) {
                //console.log("Found Peer, sending signal");
                rooms[socket.room][i].emit('signal', to, from, data);
                found = true;
                break;
            }
        }
        // if (!found) {
        // 	console.log("never found peer");
        // }
    });

    socket.on('disconnect', () => {
        console.log(Date.now(), socket.id, "Client has disconnected");
        if (rooms[socket.room]) { // Check on this
            // Tell everyone first
            let which = -1;
            for (let i = 0; i < rooms[socket.room].length; i++) {
                if (rooms[socket.room][i].id != socket.id) {
                    rooms[socket.room][i].emit('peer_disconnect', socket.id);
                } else {
                    which = i;
                }
            }
            // Now remove from array
            if (rooms[socket.room][which].id == socket.id) {
                rooms[socket.room].splice(which,1);
            }

            // This could fail if someone joins while the loops are in progress
            // Should be using associative arrays all the way around here
        }
    });
}
);