import { useState, useEffect } from 'react'
import ticketService from './services/tickets'
import './index.css'
import Column from './components/Column';
// import ticket from '../../backend/models/ticket';




const App = () => {

  const [tickets, setTickets] = useState([])

  useEffect(()=>{
    ticketService
      .getAll()
      .then(initialTickets =>{
        setTickets(initialTickets)
    })
  },[])

    


  const addTicket = (newTitle, newType, newDependencies) => {

    // const listTitles = tickets.map(ticket => ticket.title)
    // if (listTitles.includes(newTitle)) {
    //   window.alert(`${newTitle} already exists.`)
    // } else {
      const newTicket = {
        title: newTitle,
        type: newType,
        dependencies:newDependencies
      }

      ticketService
        .create(newTicket)
        .then(returnedTicket => {
          setTickets(tickets.concat(returnedTicket))
        })
    // }
  }

  const deleteTicket = (id) => {
    const titleTicket = tickets.filter(ticket => ticket.id===id)[0].title
    if (window.confirm(`Delete ${titleTicket}?`)) {
      ticketService
        .remove(id)
        .then(() => {
          const newTickets = tickets.filter(ticket=>ticket.id!==id)

          const updatePromises = newTickets.map(ticket => {
            if (ticket.dependencies.includes(titleTicket)) {
              const updatedTicket = {
                ...ticket,
                dependencies: ticket.dependencies.filter(dep => dep !== titleTicket),
              };
              return ticketService.update(ticket.id, updatedTicket);
            }
            return Promise.resolve(ticket);
          });

          Promise.all(updatePromises).then((updatedTickets) => {
            setTickets(updatedTickets);
          });
        })
    }
  }

  const editTicket = (id, newTitle, newType, newDependencies) => {

    const ticket = tickets.filter(ticket => ticket.id===id)[0]
    const updatedTicket={...ticket, title:newTitle, type:newType, dependencies:newDependencies}

    ticketService
        .update(id, updatedTicket)
        .then((updatedTicket) => {
          setTickets(tickets.map(ticket => ticket.id === id ? updatedTicket : ticket))
      })
  }

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Kanboard</h1>
      <div className="flex justify-center gap-6">
        <Column type="todo" tickets={tickets} onAdd={(title, dependencies) => addTicket(title, 'todo', dependencies)} onDelete={deleteTicket} onEdit={editTicket} />
        <Column type="doing" tickets={tickets} onAdd={(title, dependencies) => addTicket(title, 'doing', dependencies)} onDelete={deleteTicket} onEdit={editTicket} />
        <Column type="done" tickets={tickets} onAdd={(title, dependencies) => addTicket(title, 'done', dependencies)} onDelete={deleteTicket} onEdit={editTicket} />
      </div>
    </div>
  )
}

export default App