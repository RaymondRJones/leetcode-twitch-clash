import boto3
from botocore.exceptions import ClientError

# Initialize the DynamoDB client
ddb = boto3.client('dynamodb')

# Define the DynamoDB table names
rooms_table_name = "lc-clash-royale-rooms"
user_connections_table_name = "UserConnections"

def lambda_handler(event, context):
    connection_id = event['requestContext']['connectionId']
    print(f'Disconnected: {connection_id}')
    result = handle_disconnect(connection_id)
    return {
        'statusCode': 200,
        'body': f'Disconnect process completed: {result}'
    }

def handle_disconnect(connection_id):
    room_id = find_room_by_connection_id(connection_id)
    if room_id:
        print("Room ID FOUND with this connection")
        remove_user_from_room(room_id, connection_id)
    
    # Delete the user connection
    ddb.delete_item(
        TableName=user_connections_table_name,
        Key={'ConnectionID': {'S': connection_id}}
    )
    print(f'Deleted connection: {connection_id}')

def find_room_by_connection_id(connection_id):
    response = ddb.get_item(
        TableName=user_connections_table_name,
        Key={'ConnectionID': {'S': connection_id}}
    )
    if 'Item' in response and 'RoomID' in response['Item']:
        return response['Item']['RoomID']['S']
    return None

def remove_user_from_room(room_id, connection_id):
    get_params = {
        'TableName': rooms_table_name,
        'Key': {'RoomID': {'S': room_id}},
    }
    
    try:
        room_data = ddb.get_item(**get_params)
        if 'Item' in room_data and 'Connections' in room_data['Item']:
            # Filter out the connectionId from the Connections list
            updated_connections = [conn for conn in room_data['Item']['Connections']['L'] if conn['S'] != connection_id]
            
            # Update the room item with the new Connections list
            update_params = {
                'TableName': rooms_table_name,
                'Key': {'RoomID': {'S': room_id}},
                'UpdateExpression': 'SET Connections = :c',
                'ExpressionAttributeValues': {
                    ':c': {'L': updated_connections},
                },
            }
            
            ddb.update_item(**update_params)
            print(f'Removed connection {connection_id} from room {room_id}')
        else:
            print(f'Room not found with ID: {room_id}')
    except ClientError as error:
        print(f'Error removing user from room: {error}')
        raise
