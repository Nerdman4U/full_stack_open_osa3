require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebook')
let path = require('path')
let rfs = require('rotating-file-stream') // version 2.x

// middleware, Using morgan log to file
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

// middleware, olemattomat urlit
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// middleware, errorhandler
const errorHandler = (error, request, response, next) => {
    console.log("MESSAGE", error.message)
    if (error.name === "CastError") {
        return response.status(400).send({error: "malformatted id"})
    }
    next(error)
}

const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use(express.static('dist'))
//app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('combined'))
app.use(cors())

let persons = []
// let persons = [
//     {id: 1, name: "asdf1", number:1},
//     {id: 2, name: "asdf2", number:2},
//     {id: 3, name: "asdf3", number:3},
//     {id: 4, name: "asdf4", number:4},
//     {id: 5, name: "asdf5", number:5},
//     {id: 6, name: "asdf6", number:6}
// ]

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    Person.find({}).then((persons) => {
        const info_line = `Phonebook has info for ${persons.length} persons.`
        const date_line = `${Date()}`
        const result = `<div><p>${info_line}</p><p>${date_line}</p></div>`
        res.send(result)
    })
})

// => /api/person/:id (?)
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
              res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (req,res,next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {    
    Person.find({}).then((persons) => {
        res.json(persons)
    })
})

const error400Response = (res, msg) => {
    return res.status(400).json({error: msg})
}
app.post('/api/persons', (req,res) => {
    if (!req.body.name) {
        return error400Response(res,"No name.")
    }
    if (!req.body.number) {
        return error400Response(res,"No number.")
    }
    if (persons.find(person => person.name === req.body.name)) {
        return error400Response(res, "Name must be unique.")
    }

    const person = new Person({name: req.body.name, number: req.body.number})
    person.save().then((savedPerson) => {
        res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req,res,next) => {
    const number = req.body.number
    if (!number) {
        return error400Response(res,"No number.")
    }
    changed = { number: number }
    Person.findByIdAndUpdate(req.body.id, changed, {new: true})
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
})

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log("Palvelin pyörimässä!")
})


