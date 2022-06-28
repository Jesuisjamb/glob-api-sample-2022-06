const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 8080

const usersList = [
    {
        id: 1,
        name: 'John',
        valid: false,
        editor: true
    },
    {
        id: 2,
        name: 'Winston',
        valid: true,
        editor: true
    },
    {
        id: 3,
        name: 'Sam',
        valid: true,
        editor: false
    }
]

const netflixDB = [
    {
        id: 1,
        year: 2020,
        name: 'film1'
    },
    {
        id: 2,
        year: 2019,
        name: 'film2'
    },
]

const authoMiddle = (req, res, next) => {
    const userNumber = req.headers.usercode;
    const profile    = usersList.find((usr) => usr.id == userNumber);
    if(!profile.id) return res.status(404).json({'msg': 'Unauthorized User'});
    req.profile = profile
    next()
}

const findAll = () => {
    return netflixDB;
}

const findOne = (id) => {
    const result = netflixDB.filter((mov) => mov.id == id);
    return result;
}

const addOne = (movieObj) => {
    movieObj.id = netflixDB.length + 1;
    netflixDB.push(movieObj)
    return movieObj;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/movies', authoMiddle, (req, res) => {
    res.send(findAll());
});

app.get('/movies/:id', authoMiddle, (req, res) => {
    res.send(findOne(req.params.id));
});

app.post('/movies', authoMiddle, (req, res) => {
    res.send(addOne(req.body));
});

app.all('*', (req,res) => { 
    res.status(500).json({'msg': 'Invalid API Route'})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})