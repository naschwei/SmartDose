const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

function registerUser(firstName, lastName, userName, dob, email, password, callback) {

    const uniqueUserID = uuidv4();

    // TODO: need to hash password before storing it in db!

    const params = {
        TableName: 'user-profile',
        Item: {
            'userId': { S: uniqueUserID },
            'firstName': { S: firstName },
            'lastName': { S: lastName },
            'userName': { S: userName },
            'dob': { S: dob },
            'email': { S: email },
            'password': { S: password },
        },
    };

    dynamodb.putItem(params, (err, data) => {
    if (err) {
        console.error(err);
        callback(err, null);  //notify caller of error
    } else {
        console.log('User registered successfully');
        callback(null, data);  //notify caller of success
    }
    });


}
