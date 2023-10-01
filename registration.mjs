import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';




// TODO: add some logic to make sure 2 users don't sign up with the same username?
// otherwise that will mess up the login function
function registerUser(firstName, lastName, username, dob, email, password, callback) {

    const uniqueUserID = uuidv4();

    // Generating hashed password to store in db
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log("Error generating salt: ", err)
            callback(err);
            return;
        }

        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
            console.log("Error hashing password with salt: ", err)
            callback(err);
            return;
            }
            console.log('Hashed Password:', hash);

            const params = {
                TableName: 'user-profile',
                Item: {
                    'userID': { S: uniqueUserID },
                    'firstName': { S: firstName },
                    'lastName': { S: lastName },
                    'username': { S: username },
                    'dob': { S: dob },
                    'email': { S: email },
                    'password': { S: hash },
                },
            };

            const dynamodb = new DynamoDBClient({ region: 'us-east-2' }); 
            const command = new PutItemCommand(params);
            // Store user data in the database using PutItemCommand
            dynamodb.send(command)
                .then(() => {
                    console.log('User registered successfully');
                    callback(null, 'User registered successfully');
                })
                .catch((error) => {
                    console.error("Error registering user:", error);
                    callback(error, null); // Notify caller of error
                });
        });
    });
}


// below is an example of how to use the function
// registerUser("no", "no", "test-no", "no", "no", "nod", (err, data) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('Successfully registered user')
//   }
// });


function loginUser(username, password, callback) {

    const dynamodb = new DynamoDBClient({ region: 'us-east-2' });

    const params = {
        TableName: 'user-profile',
        IndexName: 'username-index', // Specify the secondary index name
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
        ':username': { S: username }, // Specify the username you want to query
        },
    };

    try {
        const command = new QueryCommand(params);
        dynamodb.send(command).then((data) => {
            if (data.Items && data.Items.length === 1) {
                const userData = data.Items[0];

                const storedHashedPassword = userData.password.S;

                bcrypt.compare(password, storedHashedPassword, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    callback(err, null);
                } else {
                    if (result) {
                    // Passwords match, login successful
                    callback(null, true);
                    } else {
                    // Passwords do not match
                    callback(null, false);
                    }
                }
                });
            } else {
                // Username not found or multiple users with the same username
                callback(null, false);
            }
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        callback(error, null);
    }
}




// this is an example of using the loginUser function !!
// loginUser('test-user', 'test-password', (err, isAuthenticated) => {
//   if (err) {
//     console.error('Login error:', err);
//   } else {
//     if (isAuthenticated) {
//       console.log('Login successful');
//       // Redirect to the authenticated user's dashboard or perform the desired action
//     } else {
//       console.log('Login failed: Invalid username or password');
//       // Handle login failure (e.g., show an error message to the user)
//     }
//   }
// });
