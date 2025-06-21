require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())

app.use(express.static('dist'))

const Ticket = require('./models/ticket')

app.get('/api/tickets', (request, response) => {
  Ticket.find({}).sort("title").then(tickets => response.json(tickets)
  )
})

app.get('/api/tickets/:id', (request, response,next) => {
  Ticket.findById(request.params.id)
    .then(ticket => {
      if (ticket) {
        response.json(ticket)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/tickets/:id', (request, response,next) => {
  Ticket.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/tickets', (request, response, next) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({ error: 'Title missing' })
  }

  const ticket = new Ticket({
    title: body.title,
    type:body.type,
    dependencies: body.dependencies,
  })

  ticket.save()
    .then(savedTicket => response.json(savedTicket))
    .catch(error => next(error))
})

app.put('/api/tickets/:id', (request, response, next) => {
  const { title, type, dependencies } = request.body

  Ticket.findById(request.params.id)
    .then(ticket => {
      if (!ticket) {
        return response.status(404).end()
      }

      ticket.title = title
      ticket.type = type
      ticket.dependencies = dependencies.toSorted()

      return ticket.save().then((updatedTicket) => response.json(updatedTicket))
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})