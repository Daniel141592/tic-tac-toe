"use strict";

require("@babel/core").transform("code", {
	presets: ["@babel/preset-env"],
});

import './env.js';
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser';
import * as mainpage from './src/controllers/mainpage.js';
import * as rooms from './src/controllers/rooms.js';
import api from './src/routes/api.js';
import * as serversocket from './src/serversocket';

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
	console.log('listening on port ' + PORT);
});

serversocket.init();
