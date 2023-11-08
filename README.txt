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

// Other Dependencies
1. sudo npm install react-native-modal

// History Screen Dependencies
npm install --save react-native-calendars
npm install --save react-native-svg react-native-chart-kit
npm install --save react-native-paper

// To run the app, run... 
npm start
// scan the QR code, and wait for the project to load


// For expo notifications to work...create an expo account or use an existing account. Run...
expo login
// Enter your username and password when prompted.
// Create a project for SmartDose and copy the project id. Replace project id variable for all notification functionality with the id. 