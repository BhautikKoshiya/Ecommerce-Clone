const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient({ region: 'us-east-1' }); // Set your region

exports.handler = async (event) => {
    try {
        console.log("event", event);
        const { cart, userId } = event.requestBody; 
        let total = 0;

        console.log("cart", cart);

        cart.forEach((c) => {
            total += c.price;
        });

        const orderId = uuidv4();
        const putParams = {
            TableName: 'Orders',
            Item: {
                orderId: { S: orderId },
                products: { S: JSON.stringify(cart) },
                userId: { S: userId },
                createdAt: { S: new Date().toISOString() },
                totalAmount: { N: total.toString() } 
            }
        };

        // Store the order in DynamoDB
        await ddbClient.send(new PutItemCommand(putParams));

        return {
            statusCode: 200,
            body: {
                success: true,
                message: "Transaction successful and order saved",
                orderId: orderId
            }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: {
                success: false,
                message: "Internal Server Error",
                error: error.message
            }
        };
    }
};
