const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.handler = async (event) => {
  const tableName = process.env.TABLE_NAME; // Ensure to set this environment variable in your Lambda function
  const connectionId = event.requestContext.connectionId;

  const params = {
    TableName: tableName,
    Key: {
      connectionId: connectionId,
    },
  };

  try {
    await ddb.delete(params).promise();
    return { statusCode: 200, body: 'Disconnected.' };
  } catch (err) {
    console.error('Error removing connection:', err);
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }
};
