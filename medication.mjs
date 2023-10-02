import { v4 as uuidv4 } from 'uuid';

import { DynamoDBClient, QueryCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';


function addMedication(userID, name, doseQuantity, doseTimings, feederNum, callback) {

    const uniqueMedID = uuidv4();

    const params = {
        TableName: 'medications', 
        Item: {
            'medID': { S: uniqueMedID },
            'userID': { S: userID },
            'name': { S: name },
            'doseQuantity': { S: doseQuantity },
            'doseTimings': { SS: doseTimings },
            'feederNum': { S: feederNum },
        },
    };

    // console.log(params)

    const dynamodb = new DynamoDBClient({ region: 'us-east-2' });
    const command = new PutItemCommand(params);

    dynamodb.send(command)
        .then(() => {
            console.log('New medication added successfully');
            callback(null, 'New medication added successfully');
        })
        .catch((err) => {
            console.error("Error adding new medication: ", err);
            callback(err, null);
        });
}


// below is an example of how to use the function
// addMedication("test", "test", "-no", ["000", "111"], "no", (err, data) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('Successfully added medication')
//   }
// });


// returns all medication that is assosciated with some userID
function getAllUserMedications(userID, callback) {

    const dynamodb = new DynamoDBClient({ region: 'us-east-2' });
    
    const params = {
        TableName: 'medications',
        IndexName: 'userID-index',
        KeyConditionExpression: 'userID = :userID',
        ExpressionAttributeValues: {
            ':userID': { S: userID },
        },
    };
    
    const command = new QueryCommand(params);

    try {
        dynamodb.send(command)
            .then((data) => {
                // send this data back to the screen
                // TODO: do we need to do anything else with it?
                callback(null, data);
            })
    } catch (err) {
        console.error('Error retrieving user medication data: ', err);
        callback(err, null)
    }
}

// this is an example of using the getAllUserMedications function !!
// getAllUserMedications('test-userid', (err, data) => {
//   if (err) {
//     console.error('Error getting all user medications: ', err);
//   } else {
//     console.log('Successfully retrieved all user medications');
//     console.log(data['Items']);
//   }
// });


//function to update usermedications
//medID cannot change if updating ! and technically neither should userID
function updateUserMedication(medID, userID, name, doseQuantity, doseTimings, feederNum, callback) {

    const dynamodb = new DynamoDBClient({ region: 'us-east-2' });

    const params = {
        TableName: 'medications', 
        Item: {
            'medID': { S: uniqueMedID },
            'userID': { S: userID },
            'name': { S: name },
            'doseQuantity': { S: doseQuantity },
            'doseTimings': { SS: doseTimings },
            'feederNum': { S: feederNum },
        },
    };
    // replaces item if medid is already present which it will be
    const command = new PutItemCommand(params);

    dynamodb.send(command)
        .then(() => {
            console.log('Medication updated successfully');
            callback(null, 'Medication updated successfully');
        })
        .catch((err) => {
            console.error("Error updating medication: ", err);
            callback(err, null);
    });

}



//TODO: function to delete user medications
function deleteUserMedication(medID, callback) {

    const dynamodb = new DynamoDBClient({ region: 'us-east-2' });

    const params = {
        TableName: 'medications', 
        Key: {
            "medID": {
                "S": medID,
            }
        }
    };

    const command = new DeleteItemCommand(params);

    dynamodb.send(command)
        .then(() => {
            console.log('Medication deleted successfully');
            callback(null, 'Medication deleted successfully');
        })
        .catch((err) => {
            console.error("Error deleting medication: ", err);
            callback(err, null);
    });
}

// deleteUserMedication('test-medid', (err, data) => {
//   if (err) {
//     console.error('Error deleting user medications: ', err);
//   } else {
//     console.log('Successfully deleted user medications');
//     console.log(data['Items']);
//   }
// });



//TODO: 