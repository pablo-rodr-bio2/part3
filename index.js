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
  Person
    .find({})
    .then(persons => {
      response.json(persons)})
})

app.get("/api/persons/:id", (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
        response.json(person)
      }
    )
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
  
  const body = request.body

  if (!body.number) {
    return response.status(404).json({
      error: "you didn't inform any number"
    })
  }

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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error=> next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted if'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})