import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare,faTrashCan, faSquare, faSquareCheck, faSquareMinus } from '@fortawesome/free-regular-svg-icons'
import { useState, useEffect } from 'react';

const Ticket = ({ticket, tickets, onEdit, onDelete}) => {

    const sortByTitle = (a, b) => {
        const titleA = a.title.toUpperCase(); 
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    }

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(ticket.title);
    const [newType, setNewType] = useState(ticket.type);
    const [newDependencies, setNewDependencies] = useState(ticket.dependencies);

    const typeIcons={
        'todo':faSquare,
        'doing':faSquareMinus,
        'done':faSquareCheck
    }

    const titles={
        'todo':"To Do",
        'doing':"Doing",
        'done':"Done"
    }

    useEffect(() => {
        setNewTitle(ticket.title);
        setNewType(ticket.type);
        setNewDependencies(ticket.dependencies);
    }, [ticket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(newTitle,newType,newDependencies)
        if (newTitle.trim()) {
            onEdit(ticket.id, newTitle.trim(), newType, newDependencies);
            setIsEditing(false);
        }
    };

    const handleAddDependency = (dependentTicket) => {
        // console.log(newTitle,newType,newDependencies)
        // dependencies that are not "done" cannot be added to a ticket marked as "done"
        if (newType==="done" && dependentTicket.type!=="done") {
            window.alert(`${dependentTicket.title} cannot be added as a dependency as ${newTitle} is marked as "done" and ${dependentTicket.title} is not.`)
        } else {
            if (newDependencies.includes(dependentTicket.id)) {
                setNewDependencies(newDependencies.filter(dep => dep !== dependentTicket.id));
            } else {
                setNewDependencies([...newDependencies, dependentTicket.id]);
            }
        }
    };

    const handleMarkAsDone = () => {
        if (newDependencies.length!==0) {
            const listTypes = newDependencies.map(ID => tickets.filter(e => e.id === ID)[0].type)
            // a ticket can't be marked as "done" if all its dependencies are not marked as "done"
            if (listTypes.every(type => type==="done") !== true) {
                window.alert(`${newTitle} can't be marked as "done" as other tasks need to be completed first.`)
            } else {
                setNewType("done")
            }
        } else {
            setNewType("done")
        }
    }

    const handleUnmarkAsDone = (type) => {
        const listDependentTickets = tickets.filter(t => t.dependencies.includes(ticket.id))
        // console.log(listDependentTickets)
        // a ticket can't be marked as "to do" or "doing" if it's in the list of dependencies of other tickets marked as done
        if (listDependentTickets.length>0 && listDependentTickets.some(e => e.type==="done")) {
            window.alert(`${newTitle} can't be marked as ${titles[type]} as other tasks that depend on this ticket have been completed.`)
        } else {
            setNewType(type)
        }
    }

    return  (
        <div>
            {isEditing && 
                (<form onSubmit={handleSubmit} className="bg-white p-3 rounded shadow space-y-2">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        autoFocus
                    />
                    <p>
                        Tasks that need to be completed first:
                        <div className="border-2 p-2 border-black rounded overflow-auto h-30">
                            {tickets.toSorted(sortByTitle)
                                .filter(t => t.id!==ticket.id)
                                .map(dependentTicket =>
                                    <div>
                                        <input 
                                            type="checkbox" 
                                            id={`${ticket.id}-dependencies-${dependentTicket.id}`} 
                                            name={`${ticket.id}-dependencies`} 
                                            value={dependentTicket.title} 
                                            onChange={()=>handleAddDependency(dependentTicket)} 
                                            checked={newDependencies.includes(dependentTicket.id)}
                                        />
                                        <label htmlFor={`${ticket.id}-dependencies-${dependentTicket.id}`}>
                                            {dependentTicket.title}
                                        </label>
                                    </div>
                            )}
                        </div>
                    </p>
                    <p className="flex gap-x-2">
                        Mark as:
                        <input 
                            type="radio" 
                            id={`todo-${ticket.id}`} 
                            name={`typeTicket-${ticket.id}`} 
                            value="todo" 
                            onChange={()=>handleUnmarkAsDone("todo")} 
                            checked={newType === 'todo'}
                        />
                        <label htmlFor={`todo-${ticket.id}`}>
                            To Do
                        </label>
                        <input 
                            type="radio" id={`doing-${ticket.id}`} 
                            name={`typeTicket-${ticket.id}`} 
                            value="doing" 
                            onChange={()=>handleUnmarkAsDone("doing")} 
                            checked={newType === 'doing'}
                        />
                        <label htmlFor={`doing-${ticket.id}`}>
                            Doing
                        </label>
                        <input 
                            type="radio" 
                            id={`done-${ticket.id}`} 
                            name={`typeTicket-${ticket.id}`} 
                            value="done" 
                            onChange={handleMarkAsDone} 
                            checked={newType === 'done'}
                        />
                        <label htmlFor={`done-${ticket.id}`}>
                            Done
                        </label>
                    </p>
                    <div className="flex justify-end gap-2">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(false)
                            setNewTitle(ticket.title)
                            setNewType(ticket.type)
                            setNewDependencies(ticket.dependencies)
                        }}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    </div>
                </form>)
            }

            {!isEditing && 
            (<div key={ticket.id} className="bg-white p-3 rounded shadow">
                <h3 className="font-semibold flex items-center gap-x-2">
                    {ticket.title}
                    <FontAwesomeIcon icon={faPenToSquare} className="text-gray-400 hover:text-black" onClick={()=>setIsEditing(true)}/>
                    <FontAwesomeIcon icon={faTrashCan} className="text-gray-400 hover:text-black" onClick={()=> onDelete(ticket.id)}/>
                </h3>
                <div style={ticket.dependencies.length===0 ? { display: "none" } : {}}>
                    <p>
                        Tasks that need to be completed first:
                    </p>
                    {tickets
                        .filter(t => ticket.dependencies.includes(t.id))
                        .toSorted(sortByTitle)
                        .map(t => (
                            <div key={t.id} className="flex items-center gap-x-1">
                                <FontAwesomeIcon icon={typeIcons[t.type]}/>
                                {t.title}
                            </div>)
                        )
                    }
                </div>
            </div>)}
        </div>)
}

export default Ticket