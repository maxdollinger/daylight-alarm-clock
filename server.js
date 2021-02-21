const express = require('express');
var cors = require('cors')

const app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const alarmClock = require('./wecker/wecker');

//API Endpoint
const api = require('./router/api');
app.use('/api', api)

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server startet in Port ${port}`))