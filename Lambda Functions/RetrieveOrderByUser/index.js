const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    const { userId } = event;

    try {
        // Fetch products by category using the GSI
        const queryProductsParams = {
            TableName: 'Orders',
            IndexName: 'OrderIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };

        const orderResult = await ddbDocClient.send(new QueryCommand(queryProductsParams));

        const orders = orderResult.Items || [];

        if (orders.length === 0) {
            return {
                statusCode: 404,
                body: {
                    success: false,
                    message: "No orders found for the given user"
                }
            };
        }

        return {
            statusCode: 200,
            body: {
                success: true,
                userId: userId,
                orders
            }
        };

    } catch (error) {
        console.error(error);

        return {
            statusCode: 400,
            body: {
                success: false,
                message: "Error while getting orders",
                error: error.message
            }
        };
    }
};
