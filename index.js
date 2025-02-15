import { Random } from 'random';
import express from 'express';
const app = express();
const encoder = new TextEncoder();

const locations = {
    "School": [
        "Teacher",
        "Student",
        "Janitor",
        "Principal",
        "Nurse",
        "Assistant",
        "Student",
        "Student",
        "Student",
    ],
    "Prison": [
        "Prisoner", 
        "Guard", 
        "Warden", 
        "Guard Dog", 
        "Lunch Lady", 
        "Tower Lookout",
        "Lvl 100 Mafia Boss",
        "Lvl 110 Sneak Inmate",
        "Lvl -2 Crook"
    ]
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get ( '/', (_, res) => res.sendFile(import.meta.dirname + "/index.html"));
app.post( '/', StartGame);
app.all ( '/teapot', (_, response) => response.sendStatus(418) );
app.use ( (_, response) => response.sendStatus(404) );
app.listen(3000);

// Generate new game from input
function StartGame(request, response) {
	const lobby = request.body.lobby;
	const player = Number(request.body.player);
	const contestants = Number(request.body.contestants);
    
    let lobbyID = 1;
    encoder.encode(lobby).forEach((byte) => {lobbyID *= byte});
    const rng = new Random(lobbyID);
    const spy = rng.int(0, contestants - 1);
    const location = Object.keys(locations).at(rng.int(0, Object.keys(locations).length - 1));
	const locationLength = Object.values(locations[location]).length;
	let roleID = rng.int(0, locationLength - 1) + player;
	while (roleID > locationLength) { roleID -= locationLength };
    const role = Object.values(locations[location]).at(roleID);
	
    if (spy == player) {
		// IS SPY!
		// response.json({"location": "unknown", "role": "spy"});
    }
    
    console.log(`${location}: ${role} (Spy: ${spy})`);
    console.log(roleID);
    
    response.json({"location": location, "role": role});
}