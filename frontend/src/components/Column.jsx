import { useState } from 'react';
import Ticket from './Ticket';

const Column = ({ type, tickets, onAdd, onEdit, onDelete}) => {
  const filteredTickets = tickets.filter(ticket=>ticket.type===type).toSorted((a, b) => {
    const titleA = a.title.toUpperCase(); 
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) return -1
    if (titleA > titleB) return 1
    return 0})

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDependencies, setNewDependencies] = useState([]);

  const colorTitles={
    'todo':"text-red-500",
    'doing':"text-orange-500",
    'done':"text-green-500"
  }

  const titles={
    'todo':"To Do",
    'doing':"Doing",
    'done':"Done"
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const listTitles = tickets.map(ticket => ticket.title)
    if (listTitles.includes(newTitle)) {
      window.alert(`${newTitle} already exists.`)
    } else if (newTitle.trim()) {
      onAdd(newTitle.trim(),newDependencies);
      setNewTitle('');
      setNewDependencies([])
      setIsAdding(false);
    }
  };

  const handleAddDependency = (dependentTicket) => {
    // console.log(dependentTicket)
    // dependencies that are not "done" cannot be added to a ticket marked as "done"
    if (type==="done" && dependentTicket.type!=="done") {
        window.alert(`${dependentTicket.title} cannot be added as a dependency as ${newTitle} is marked as "done" and ${dependentTicket.title} is not.`)
    } else {
        if (newDependencies.includes(dependentTicket.id)) {
            setNewDependencies(newDependencies.filter(dep => dep !== dependentTicket.id));
        } else {
            setNewDependencies([...newDependencies, dependentTicket.id]);
        }
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 shadow-md w-full max-w-sm min-h-[500px] flex flex-col">
      <h2 className={`ctext-lg font-bold mb-4 text-center ${colorTitles[type]}`}>
        {titles[type]}
      </h2>


      <div className="flex-1 space-y-4">
        {filteredTickets.map(ticket => 
        <Ticket key={ticket.id} ticket={ticket} tickets={tickets} onEdit={onEdit} onDelete={onDelete}/>)}

        {isAdding && 
          (<form onSubmit={handleSubmit} className="bg-white p-3 rounded shadow space-y-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Ticket title"
              autoFocus
            />
            <p>
              Tasks that need to be completed first:
              <div className="border-2 p-2 border-black rounded overflow-auto h-30">
                  {tickets.map(dependentTicket=>
                    <div>
                        <input 
                            type="checkbox" 
                            id={`dependencies-${dependentTicket.id}`} 
                            name="dependencies"
                            value={dependentTicket.title} 
                            onChange={()=>handleAddDependency(dependentTicket)}
                            checked={newDependencies.includes(dependentTicket.id)}
                        />
                        <label htmlFor={`dependencies-${dependentTicket.id}`}>
                            {dependentTicket.title}
                        </label>
                    </div>
                  )}
                </div>
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Save
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setNewTitle(''); setNewDependencies([]) }}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>)
        }
      </div>

      {!isAdding && 
        (<button
          onClick={() => setIsAdding(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Add ticket
        </button>)
      }
    </div>
  );
};

export default Column;