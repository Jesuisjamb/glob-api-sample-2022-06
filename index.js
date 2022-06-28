const express    = require('express')
const bodyParser = require('body-parser');
const app        = express()
const port       = 8080

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
    const userNumber = req.headers.token;
    const profile    = usersList.filter((usr) => ((usr.id == userNumber) && usr.valid));
    if(profile.length < 1) return res.status(404).json({'msg': 'Unauthorized User'});
    req.profile = profile
    next()
}

const findAll = () => {
    return netflixDB;
}

const findByYear = (year) => {
    const result = netflixDB.filter((mov) => mov.year == year);
    return result;
}

const addOne = (movieObj) => {
    movieObj.id = netflixDB.length + 1;
    netflixDB.push(movieObj)
    return movieObj;
}

const checkYear = (value) => {
    return value.match(/^(19|20)[0-9][0-9]/)
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/movies', authoMiddle, (req, res) => {
    res.json(findAll());
});

app.get('/movies/:year', authoMiddle, (req, res) => {
    const isValidYear = checkYear(req.params.year);
    if(!isValidYear) res.status(404).json({'msg':'Missing Correct Year Value'});
    else res.json(findByYear(req.params.year));
});

app.post('/movies', authoMiddle, (req, res) => {
    res.json(addOne(req.body));
});

app.all('*', (req,res) => { 
    res.status(500).json({'msg': 'Invalid API Route'})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})