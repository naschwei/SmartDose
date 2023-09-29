const { v4: uuidv4 } = require('uuid');

const AWS = require('aws-sdk'),
      {
          DynamoDB
      } = require("@aws-sdk/client-dynamodb");


AWS.config.update({region:'us-east-2'});

const dynamodb = new DynamoDB();

function registerUser(firstName, lastName, username, dob, email, password, callback) {

    const uniqueUserID = uuidv4();

    // TODO: need to hash password before storing it in db!

    const params = {
        TableName: 'user-profile',
        Item: {
            'userID': { S: uniqueUserID },
            'firstName': { S: firstName },
            'lastName': { S: lastName },
            'username': { S: username },
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


registerUser("testeste", "somelastname", "someusername", "somedob", "someemail", "somepasswrod", (err, data) => {
  if (err) {
    console.log(err)
  } else {
    // Proceed with user registration
    console.log('successfully registered')
  }
});