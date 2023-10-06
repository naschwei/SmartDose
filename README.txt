// how to set up environment to view the software
1. Install Expo Go on Mobile Device
2. Ensure Node.js is installed 


// Dependencies needed to add navigation bar. 
// Run the following commands to install...

1. sudo add @react-navigation/native
2. sudo expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
3. sudo add @react-navigation/stack
4. sudo add @react-navigation/bottom-tabs
5. sudo npm install react-native-vector-icons


// Steps for accessing AWS and database features/functionality 
// Note : you will need this to test user registration/login, authentication, adding medication, viewing medication, etc.
Use the following link to download the AWS CLI on your local machine:
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
In your terminal, run the 'aws configure' command. 
Enter the access key ID (given to you), secret access key ID (given to you), 'us-east-2' for the region-name, and keep the default for the default output format (just press enter).
