import { Random } from 'random';
import express from 'express';
import fs from 'node:fs';
const app = express();
const encoder = new TextEncoder();
const locations = JSON.parse(fs.readFileSync(import.meta.dirname + "/locations.json"));

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
    let lobbyBytes = encoder.encode(lobby);
    let lobbyID = 1;
	lobbyBytes.forEach((byte) => { lobbyID *= byte });
    const rng = new Random(lobbyID);
    lobbyBytes = lobbyBytes.map((_) => { return rng.int(48, 122) });
    const spy = rng.int(1, contestants);
    const location = Object.keys(locations).at(rng.int(0, Object.keys(locations).length - 1));
	const locationLength = Object.values(locations[location]).length;
	let roleID = rng.int(0, locationLength - 1) + player;
	while (roleID >= locationLength) { roleID -= locationLength };
    const role = Object.values(locations[location]).at(roleID);
	console.log(`${location}: ${role} (Spy: ${spy})`);
    
    return response.json({
    	"lobby": String.fromCharCode.apply(null, lobbyBytes),
    	"location": spy == player ? "Unknown" : location,
    	"role": spy == player ? "Spy" : role,
    	"locations": Object.keys(locations)
    });
}