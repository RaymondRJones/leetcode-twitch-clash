// connect
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.handler = async (event) => {
  const tableName = "TwitchWebSocketConnections"; // Ensure to set this environment variable in your Lambda function
  const connectionId = event.requestContext.connectionId;

  const params = {
    TableName: tableName,
    Item: {
      connectionId: connectionId,
      // Add any additional attributes you might need, such as timestamp, username (if provided), etc.
    },
  };

  try {
    await ddb.put(params).promise();
    return { statusCode: 200, body: 'Connected.' };
  } catch (err) {
    console.error('Error storing connection:', err);
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
};
