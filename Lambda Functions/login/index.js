const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// AWS.config.update({ region: process.env.AWS_REGION });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = "Users";
const JWT_SECRET = "projectadvancedcloud";

exports.handler = async (event) => {
    try {
        const { email, password } = event;

        // Validation
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid email or password",
                }),
            };
        }

        // Fetch user from DynamoDB
        const params = {
            TableName: USERS_TABLE,
            Key: {
                email: email,
            },
        };

        const { Item: user } = await dynamoDB.get(params).promise();

        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "User not registered!",
                }),
            };
        }

        // Check password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid Password!",
                }),
            };
        }

        // Token generation
        const token = jwt.sign({ _id: user.email }, JWT_SECRET);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Login Successfully!!",
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                },
                token: token,
            }),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                message: "Error in login",
                error: error.message,
            }),
        };
    }
};
