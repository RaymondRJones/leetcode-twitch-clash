import boto3
import uuid
import json

# Initialize a DynamoDB resource with Boto3
dynamodb = boto3.resource('dynamodb')

# Your DynamoDB table name
rooms_table_name = 'clash-rooms'

def create_room(connection_id, username):
    room_id = generate_room_id()
    print("Generated Room ID", room_id)
    
    try:
        dynamodb.Table(rooms_table_name).put_item(
            Item={
                'RoomId': room_id,
                'Connections': [{
                    'connectionId': connection_id,
                    'username': username,
                    'is_room_creator': True,
                    'submissionTime': None  # 'None' represents a lack of value, similar to 'undefined' in JavaScript
                }],
            }
        )
        print('Room created:', room_id)
        return {'statusCode': 200, 'body': 'Room created successfully with room ID: ' + room_id}
    except Exception as e:
        print(f"Error creating room: {e}")
        return {'statusCode': 500, 'body': 'Failed to create room'}

def generate_room_id():
    return uuid.uuid4().hex[:9]

def lambda_handler(event, context):
    print("Heres the event,", event)
    # The connection_id is provided by the API Gateway in the event object
    connection_id = event.get('connectionId')
    print("connection id", connection_id)
    # Assuming the username is sent as part of the body in a WebSocket message
    # For example, the client sends a message with {"action": "createRoom", "username": "exampleUser"}

    username = event.get('username', 'defaultUsername')  # Use a default username if none is provided
     # Provide a default username if none is provided
    print("Grab username", username)
    # Attempt to create the room
    result = create_room(connection_id, username)
    return result

# Note: Ensure your AWS Lambda function has the necessary permissions to write to the DynamoDB table.
