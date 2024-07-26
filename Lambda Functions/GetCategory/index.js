const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const tableName = "Categories"; // Set your DynamoDB table name in the environment variables

    try {
        // Query DynamoDB table
        const params = {
            TableName: tableName
        };
        const result = await dynamoDb.scan(params).promise();

        // Prepare response
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "All Categories List",
                categories: result.Items
            })
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        
        return {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                message: "Error while getting all categories",
                error: error.message
            })
        };
    }
};
