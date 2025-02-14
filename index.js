const express = require('express');
const app = express();
const port = 3000;

app.get( '/', (_, res) => res.sendFile(__dirname + "/index.html"));
app.all( '/teapot', (_, response) => response.sendStatus(418) );
app.use( (_, response) => response.sendStatus(404) );
app.listen(port, () => { console.log(`Listening on port ${port}\n`) });
