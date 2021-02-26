const express = require('express');
const cors = require('cors')
const modules = require('./loadModules')({
    path: './modules',
    fileEnding: 'Module.js',
})

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//API Endpoint
app.use('/api', modules.api)

const port = process.argv[2] === 'prod' ? 80 : 8000;
const server = app.listen(port, () => console.log(`Server startet on Port ${port}`))