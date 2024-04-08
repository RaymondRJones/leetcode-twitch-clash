import json
import boto3
from boto3.dynamodb.conditions import Key


dynamodb = boto3.resource('dynamodb')
rooms_table_name = 'clash-rooms'

def join_room(room_id, connection_id, username):
    table = dynamodb.Table(rooms_table_name)
    
    try:
        response = table.get_item(Key={'RoomId': room_id})
    except Exception as e:
        print(f"Error retrieving room: {e}")
        return {'statusCode': 500, 'body': json.dumps('Failed to retrieve room')}
    
    if 'Item' not in response:
        return {'statusCode': 404, 'body': json.dumps('Room not found')}
    
    room = response['Item']
    
    # Check if user is already in the room or room is full, etc.
    # This logic depends on how you want to manage room memberships
    
    # Add new player to the room's connections
    try:
        result = table.update_item(
            Key={'RoomId': room_id},
            UpdateExpression='SET Connections = list_append(Connections, :new_player)',
            ExpressionAttributeValues={
                ':new_player': [{
                    'connectionId': connection_id,
                    'username': username,
                    'is_room_creator': False,
                    'submissionTime': None
                }]
            },
            ReturnValues='UPDATED_NEW'
        )
        print('Player added to the room:', room_id)
        return {'statusCode': 200, 'body': json.dumps('Player added successfully to room ID: ' + room_id)}
    except Exception as e:
        print(f"Error adding player to room: {e}")
        return {'statusCode': 500, 'body': json.dumps('Failed to add player to room')}

def lambda_handler(event, context):
    # Extracting room_id, connection_id, and username from the event
    body = json.loads(event['body'])
    room_id = body.get('roomId')
    connection_id = event['requestContext']['connectionId']
    username = body.get('username')
    
    if not room_id or not username:
        return {'statusCode': 400, 'body': json.dumps('Missing room_id or username')}
    
    result = join_room(room_id, connection_id, username)
    return result
