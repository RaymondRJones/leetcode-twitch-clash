// Create Room

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const roomCode = requestBody.roomCode;
    const username = requestBody.username; // Assuming the master's username is sent in the request

    const params = {
        TableName: "Rooms",
        Item: {
            RoomID: roomCode,
            UserID: "MASTER", // A special UserID for the room master
            Username: username,
            ConnectionID: event.requestContext.connectionId,
            // Additional attributes like CurrentQuestion, etc.
        }
    };

    try {
        await ddb.put(params).promise();
        return { statusCode: 200, body: 'Room created.' };
    } catch (err) {
        return { statusCode: 500, body: 'Failed to create room: ' + JSON.stringify(err) };
    }
};
