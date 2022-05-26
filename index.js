const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/info", (request, response) => {
  const today = new Date()
  response.send(
    `<div>
      <div>Phonebook has info for ${persons.length} persons</div>
      <div>${today}</div>
     </div>`
  )
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find( person => person.id === id )
  if(person) {
    console.log("Request person: ", person)
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  if(persons.find(person => person.name === body.name)){
    return response.status(404).json({
      error: "name already exists"
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})