"use strict";

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const mainpage = require('./src/controllers/mainpage.js');
const rooms = require('./src/controllers/rooms.js');
const api = require('./src/routes/api.js');

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
