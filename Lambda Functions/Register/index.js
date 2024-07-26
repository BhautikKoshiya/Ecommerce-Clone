const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

// Initialize DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Function to hash the password
const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

exports.handler = async (event) => {
    console.log("event", event)
    const { name, email, password, phone, address } = event;

    // DynamoDB table name
    const tableName = 'Users';  // Replace with your DynamoDB table name

    try {
        // Check if user already exists
        const existingUser = await dynamoDb.get({
            TableName: tableName,
            Key: { email },
        }).promise();

        if (existingUser.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: false,
                    message: 'Already registered, please login!',
                }),
            };
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Save new user
        const user = {
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role:0,
        };

        await dynamoDb.put({
            TableName: tableName,
            Item: user,
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'User registered successfully!',
                user,
            }),
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                message: 'Something went wrong while registration!',
                error: error.message,
            }),
        };
    }
};
