import AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient();
const roomsTableName = "lc-clash-royale-rooms";
const userConnectionsTableName = "UserConnections";

export const handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;
    const parsedBody = event.body ? JSON.parse(event.body) : {};

    try {
        switch(routeKey) {
            case '$connect':
                console.log('Connected:', connectionId);
                break;
            case '$disconnect':
                console.log('Disconnected:', connectionId);
                await handleDisconnect(connectionId);
                break;
            case 'createRoom':
                return await createRoom(connectionId, parsedBody.username);
            case 'joinRoom':
                return await joinRoom(connectionId, parsedBody);
            default:
                console.log('NONSTANDARD MESSAGE -> Received message:', event.body);
                break;
        }
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'An error occurred.' }) };
    }

    return { statusCode: 200, body: 'Data processed' };
};

async function handleDisconnect(connectionId) {
    const room = await findRoomByConnectionId(connectionId);
    if (room) {
        await removeUserFromRoom(room, connectionId);
    }
    await ddb.delete({
        TableName: userConnectionsTableName,
        Key: { 'ConnectionID': connectionId }
    }).promise();
}

async function findRoomByConnectionId(connectionId) {
    const data = await ddb.get({
        TableName: userConnectionsTableName,
        Key: { 'ConnectionID': connectionId },
    }).promise();
    return data.Item ? data.Item.RoomID : null;
}

async function removeUserFromRoom(roomId, connectionId) {
    // Fetch the current state of the room to get the Connections list
    const getParams = {
        TableName: roomsTableName,
        Key: { 'RoomID': roomId },
    };

    try {
        const roomData = await ddb.get(getParams).promise();

        if (roomData.Item) {
            // Filter out the connectionId from the Connections list
            const updatedConnections = roomData.Item.Connections.filter(conn => conn.connectionId !== connectionId);

            // Update the room item with the new Connections list
            const updateParams = {
                TableName: roomsTableName,
                Key: { 'RoomID': roomId },
                UpdateExpression: 'set Connections = :c',
                ExpressionAttributeValues: {
                    ':c': updatedConnections,
                },
            };

            await ddb.update(updateParams).promise();
            console.log(`Removed connection ${connectionId} from room ${roomId}`);
        } else {
            console.log(`Room not found with ID: ${roomId}`);
        }
    } catch (error) {
        console.error(`Error removing user from room: ${error}`);
        throw error; // Rethrow the error for further handling if needed
    }
}


async function createRoom(connectionId, username) {
    const roomID = generateRoomID();
    await ddb.put({
        TableName: roomsTableName,
        Item: {
            RoomID: roomID,
            Connections: [{ connectionId, username, is_room_creator: true, submissionTime: undefined }],
        },
    }).promise();
    console.log('Room created:', roomID);
    return { statusCode: 200, body: JSON.stringify({ roomID }) };
}

async function joinRoom(connectionId, { username, roomId }) {
    const roomExists = await checkRoomExists(roomId);
    if (roomExists) {
        // Logic to add user to room and update UserConnections table
    } else {
        console.log('Room not found:', roomId);
        return { statusCode: 404, body: JSON.stringify({ error: "Room not found" }) };
    }
}

async function checkRoomExists(roomId) {
    const result = await ddb.get({
        TableName: roomsTableName,
        Key: { "RoomID": roomId }
    }).promise();
    return !!result.Item;
}

function generateRoomID() {
    return `Room-${Math.random().toString(36).substr(2, 9)}`;
}