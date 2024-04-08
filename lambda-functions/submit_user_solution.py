import json
import boto3
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
rooms_table_name = 'clash-rooms'

def set_accepted_solution(room_id, username):
    table = dynamodb.Table(rooms_table_name)
    current_time = datetime.now(timezone.utc)

    # Update the submissionTime for a specific username in the Connections list
    try:
        # Retrieve the current room item
        response = table.get_item(Key={'RoomId': room_id})
        if 'Item' not in response:
            return {'statusCode': 404, 'body': json.dumps('Room not found')}
        
        room = response['Item']
        updated_connections = []

        # Check each connection to see if it matches the username
        for conn in room['Connections']:
            if conn['username'] == username:
                conn['submissionTime'] = current_time.isoformat()
            updated_connections.append(conn)
        
        # Update the item in DynamoDB
        table.update_item(
            Key={'RoomId': room_id},
            UpdateExpression='SET Connections = :val',
            ExpressionAttributeValues={
                ':val': updated_connections
            }
        )
        return {'statusCode': 200, 'body': json.dumps('Solution accepted and time recorded successfully')}
    
    except Exception as e:
        print(f"Error updating submission time: {e}")
        return {'statusCode': 500, 'body': json.dumps('Failed to update submission time')}

def lambda_handler(event, context):
    body = json.loads(event['body'])
    room_id = body.get('roomId')
    username = body.get('username')
    
    if not room_id or not username:
        return {'statusCode': 400, 'body': json.dumps('Missing roomId or username')}

    result = set_accepted_solution(room_id, username)
    return result
