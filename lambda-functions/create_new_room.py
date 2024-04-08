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
        return {'statusCode': 200, 'body': 'Room created successfully with room ID: ' +
            room_id + 'for connectionID' + connection_id + "with username:" + username}
    except Exception as e:
        print(f"Error creating room: {e}")
        return {'statusCode': 500, 'body': 'Failed to create room'}

def generate_room_id():
    return uuid.uuid4().hex[:9]

def lambda_handler(event, context):
    print("Heres the event,", event)
    connection_id = event["requestContext"]["connectionId"]
    print("connection id", connection_id)
    event_body_data = event["body"]
    print("EVENT DATA", event_body_data)
    username = json.loads(event_body_data).get("username")
    print("LOADING username from json", username)
    result = create_room(connection_id, username)
    return result

# Note: Ensure your AWS Lambda function has the necessary permissions to write to the DynamoDB table.
