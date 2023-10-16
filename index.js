const express = require('express')
const PORT = 3001

const app = express()
app.use(express.json())

let persons = [
    {id: 1, name: "asdf1", number:1},
    {id: 2, name: "asdf2", number:2},
    {id: 3, name: "asdf3", number:3},
    {id: 4, name: "asdf4", number:4},
    {id: 5, name: "asdf5", number:5},
    {id: 5, name: "asdf6", number:6}
]

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    const info_line = `Phonebook has info for ${persons.length} persons.`
    const date_line = `${Date()}`
    const result = `<div><p>${info_line}</p><p>${date_line}</p></div>`
    res.send(result)
})

// => /api/person/:id (?)
app.get('/api/persons/:id', (req, res) => {
    const _id = Number(req.params.id)
    const person = persons.find(person => person.id === _id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const _id = Number(req.params.id)
    persons = persons.filter((person) => person.id !== _id)
    res.status(204).end()
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const errorResponse = (res, msg) => {
    return res.status(400).json({error: msg})
}
app.post('/api/persons', (req,res) => {
    if (!req.body.name) {
        return errorResponse(res,"No name.")
    }
    if (!req.body.number) {
        return errorResponse(res,"No number.")
    }
    if (persons.find(person => person.name === req.body.name)) {
        return errorResponse(res, "Name must be unique.")
    }

    const person = {
        name: req.body.name,
        number: req.body.number,
        id: Math.floor(Math.random() * 100000)
    }
    persons = persons.concat(person)
    res.json(person)
})

app.listen(PORT, () => {
    console.log("Palvelin pyörimässä!")
})
