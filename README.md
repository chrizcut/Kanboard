# My Kanboard

<img src="frontend/screenshots/Homepage.png" height="350" alt="Homepage of the application">

An application where tickets can be created, edited and deleted. Tickets can be linked using dependencies.

## Description

1. A ticket can be edited and its title, status and dependencies can be changed.

<img src="frontend/screenshots/Edit_ticket.png" height="300" alt="Editing a ticket">

2. A ticket can not be marked as *done* if all its dependencies are not maked as *done*.

<img src="frontend/screenshots/Mark_ticket_done_dependencies_not_done.png" height="350" alt="Marking a ticket as done when its dependencies are not done">
<img src="frontend/screenshots/Mark_ticket_done_dependencies_done.png" height="350" alt="Marking a ticket as done when its dependencies are done">

3. The status of a ticket marked as *done* can not be changed if other tickets marked as *done* rely on it.

<img src="frontend/screenshots/Unmark_ticket_done_when_in_dependencies_done_tickets.png" height="350" alt="Unmarking a ticket as done when other tickets marked as done have it in their dependencies">

4. If a ticket is deleted, it is removed from the dependencies of the other tickets.

<img src="frontend/screenshots/Homepage.png" height="350" alt="Task 1 is in the dependencies of tasks 3 and 4">
<img src="frontend/screenshots/Delete_ticket.png" height="350" alt="Task 1 is deleted and disppears from the dependencies of tasks 3 and 4">

## How to use

1. Create a .env file in the backend folder.

2. Create a MongoDB collection and fill in the .env file with the necessary information.

MONGODB_URI=

PORT=

3. Run *npm install* then *npm start* in the backend folder.

## Technologies used

- React
- JavaScript
- Node.js
- Express
- MongoDB