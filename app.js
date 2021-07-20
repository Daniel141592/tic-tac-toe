"use strict";

require("@babel/core").transform("code", {
	presets: ["@babel/preset-env"],
});

import _ from './env.js';
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser';
import * as mainpage from './src/controllers/mainpage.js';
import * as rooms from './src/controllers/rooms.js';
import api from './src/routes/api.js';
//import WebSocketServer from 'ws';

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

//const wss = new WebSocketServer( { port: PORT });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.get('/', mainpage.get);
app.post('/', mainpage.post);

app.use('/api', api);

app.get('/:id', rooms.check, rooms.get);
app.post('/:id', rooms.check, rooms.post);

// wss.on('connection', function connection(ws) {
// 	ws.on('message', function incoming(message) {
// 		console.log('received: %s', message);
// 	});
// 	ws.send('elooo');
// });

app.listen(PORT, () => {
	console.log('listening on port ' + PORT);
});
