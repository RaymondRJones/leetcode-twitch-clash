const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { RoomID, UserID, submissionStatus, submissionTime } = body;

    // Only proceed if the submission was accepted.
    if (submissionStatus !== 'Accepted') {
        return { statusCode: 400, body: 'Submission not accepted' };
    }

    // Assume submissionTime is passed in the correct format (e.g., UNIX timestamp, ISO 8601 string, etc.)
    // No need to generate a new timestamp here, using the provided submissionTime directly.

    const params = {
        TableName: 'RoomLeaderboard',
        Key: {
            'RoomID': RoomID,
            'UserID': UserID
        },
        UpdateExpression: 'set SubmissionTime = :t',
        ExpressionAttributeValues: {
            ':t': submissionTime // Use the provided submissionTime
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        // Perform the update in DynamoDB.
        const result = await ddb.update(params).promise();
        console.log('Update result:', result);

        // Return a successful response.
        return { statusCode: 200, body: 'Submission time updated' };
    } catch (err) {
        console.error('DynamoDB error:', err);
        return { statusCode: 500, body: 'Failed to update submission time' };
    }
};
