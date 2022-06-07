require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/info", (request, response) => {
  const today = new Date()
  Person.find({}).then(persons => {
    response.send(
      `<div>
        <div>Phonebook has info for ${persons.length} persons</div>
        <div>${today}</div>
       </div>`
    )
  })
 
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
        response.json(person)
      }
    )
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log("Deleting ", id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 50 + 4)
}

app.post("/api/persons", (request, response) => {
  
  const body = request.body

  if (!body.number) {
    return response.status(404).json({
      error: "you didn't inform any number"
    })
  }

  // if(persons.find(person => person.name === body.name)){
  //   return response.status(404).json({
  //     error: "name already exists"
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(
      savedPerson => {
        response.json(savedPerson)
      }
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})