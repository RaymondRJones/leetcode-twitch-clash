import boto3
from botocore.exceptions import ClientError

# Initialize the DynamoDB client
ddb = boto3.client('dynamodb')

# Define the DynamoDB table name
user_connections_table_name = "UserConnections"

def lambda_handler(event, context):
    # Extract the connection ID from the event
    connection_id = event['requestContext']['connectionId']

    # Define the parameters for the DynamoDB put operation
    params = {
        'TableName': user_connections_table_name,
        'Item': {
            'ConnectionID': {'S': connection_id},
            # Additional attributes can be added here
        },
    }

    try:
        # Perform the put operation to add the item to the table
        ddb.put_item(**params)
        print(f'Connected: {connection_id}')
        return {'statusCode': 200, 'body': 'Connected.'}
    except ClientError as err:
        print(f'Error on connect: {err}')
        return {'statusCode': 500, 'body': 'Failed to connect.'}