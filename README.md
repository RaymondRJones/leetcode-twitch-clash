# Intro

I like being able to solve Leetcode questions against people, LeetRooms was able to do this, but it's currently broken.

Also, apparently it logs keystrokes, passwords and other things, despite being open source. 

I'm making LC Clash Royale to act as a better version.
# Starting the Project

## Frontend

This is a React application for Frontend. Installed with Node version `20.5.1`

React allows the chrome extensions to be built by running a command with meta-data in the `manifest.json` 

The chrome extension can be built and then uploaded directly into Google Chrome as an extension.

#### To run the React app

cd into `leetcode-clash` using:
```
cd leetcode-clash
```
then
```
npm start
```
#### To Build the Chrome Extension for Deployment (dev or production)

```
npm run build
```

This will update the build directory. You can zip this and upload the contents into your Google Chrome. It's under something like "Load Package" in the UI.

After importing it to chrome, you can start playing around with the UI of the application if you want.

## Backend

The app uses Python with AWS Lambda Functions to write/read data using DynamoDB and AWS API Gateway.

AWS API Gateways uses web sockets to maintain connections to users with their rooms. 
The DB is storing the data for all the rooms, like the roomID, users inside the room, their submissions, etc.
  

# Things to Do as of April 1st, 2024

##### Front-end side
There's a ton of front-end things that can be improved on. For the core functionaltiy, the user flow needs to use dummy data first and be able to create rooms, join rooms, and see other users in rooms.

Currently, a user can't really do any of this. It's just a chrome extension that asks for a user name and password and then navigates the user to the room regardless of input.

##### Backend

The AWS Lambda functions need to be completed inside the `lambda-functions` folder. These will perform operations like

```
createRoom()
joinRoom()
submitSolution()
```

The connect and disconnect to websocket are already completed

The AWS API Gateway is set up and I've created a public key that can have about 100 requests per month to the server for testing. 

You can let me know if you want access to it, or want to start testing some Lambda functions on your own machine. That'd be helpful for getting these three functions complete and set up.

createRooms will send a request to the lambda functions like
`{action: "createRoom", "username":"emily"}

The server should create a random room_id using uuid with some length, then it will add the connectionID of the user and attach it to the username. It will create the room in the database and list "emily" as one of the users. It will return the 

JoinRoom will send a request to the lambda function like 
`{action: "joinRoom", "username":"emily", "roomId":"abcd3"}

The server should check if the roomID exists in the database, if it does, it should add the user into the room's list of users. It will return a list of users to the user and information about the room (Or does this always happen with websocket?)

SubmitSolution will send a request to the lambda function like 
`{"action": "joinRoom", "username":"emily", "status": "Accepted"}

It will set the status of the user as accepted or completed based on the status.
# Other Things

I'll likely make a video explaining the design at another point