const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()
const port = 3000
const mysql = require('promise-mysql')

app.engine('handlebars', expressHandlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'))

const accounts = [
    {
        id: 1,
        firstname: 'Jane',
        surname: 'Doe',
        title: 'Ms',
        balance: 2300
    },
    {
        id: 2,
        firstname: 'John',
        surname: 'Doe',
        title: 'Mr',
        balance: 300
    },
    {
        id: 3,
        firstname: 'Jose',
        surname: 'Brewer',
        title: 'Mr',
        balance: 986
    },
    {
        id: 4,
        firstname: 'Jessie',
        surname: 'Krause',
        title: 'Mrs',
        balance: 4378
    },
    {
        id: 5,
        firstname: 'Brayden',
        surname: 'Schultz',
        title: 'Mr',
        balance: 202
    },
    {
        id: 6,
        firstname: 'Serena',
        surname: 'Mercado',
        title: 'Mrs',
        balance: 400
    },
    {
        id: 7,
        firstname: 'Serena',
        surname: 'Jones',
        title: 'Mrs',
        balance: 370
    },
]

app.get('/accounts', (req, res) => {
    let filteredAccounts = accounts
    if(req.query.id) {
        filteredAccounts = filteredAccounts.filter((account) => req.query.id == account.id)
    }
    if (req.query.balance) {
        filteredAccounts = filteredAccounts.filter((account) => req.query.balance < account.balance)
    }
    if (req.query.firstname) {
        filteredAccounts = filteredAccounts.filter((account) => account.firstname.includes(req.query.firstname))
    }
        res.json(filteredAccounts)
})

app.get('/', async (req, res) => {
    const connection = await mysql.createConnection({
        user: 'root',
        password: 'password',
        database: 'collectorsapp'
    })

    let marvelCharacters = await connection.query('SELECT * FROM `marvelcharacters`')

    if(req.query.id) {
        marvelCharacters = marvelCharacters.filter((character) => req.query.id == character.id)
    }
    if(req.query.name) {
        marvelCharacters = marvelCharacters.filter((character) =>  character.name.toLowerCase().includes(req.query.name.toLowerCase()))
    }
    if(req.query.alignment) {
        marvelCharacters = marvelCharacters.filter((characters) => characters.alignment.toLowerCase().includes(req.query.alignment.toLowerCase()))
    }
    if(req.query.height) {
        marvelCharacters = marvelCharacters.filter((characters) => req.query.height < characters.heightCm)
    }
    if(req.query.weight) {
        marvelCharacters = marvelCharacters.filter((characters) => req.query.weight < characters.weightKg)
    }
    if(req.query.placeOfBirth) {
        marvelCharacters = marvelCharacters.filter((characters) => characters.placeOfBirth.toLowerCase().includes(req.query.placeOfBirth.toLowerCase()))
    }
    res.render('home', {data: marvelCharacters})
})

app.listen(port)