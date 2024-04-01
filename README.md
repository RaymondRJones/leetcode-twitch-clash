# Intro

I like being able to solve Leetcode questions against people, LeetRooms was able to do this, but it's currently broken. I'm not smart enough to fix what's wrong with it.

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
# Other Things

I'll likely make a video explaining the design at another point