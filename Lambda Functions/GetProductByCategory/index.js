const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    const { category } = event;

    try {
        // Fetch products by category using the GSI
        const queryProductsParams = {
            TableName: 'Product',
            IndexName: 'CategoryIndex',
            KeyConditionExpression: 'category = :category',
            ExpressionAttributeValues: {
                ':category': category
            }
        };

        const productsResult = await ddbDocClient.send(new QueryCommand(queryProductsParams));

        const products = productsResult.Items || [];

        if (products.length === 0) {
            return {
                statusCode: 404,
                body: {
                    success: false,
                    message: "No products found for the given category"
                }
            };
        }

        return {
            statusCode: 200,
            body: {
                success: true,
                category: category,
                products
            }
        };

    } catch (error) {
        console.error(error);

        return {
            statusCode: 400,
            body: {
                success: false,
                message: "Error while getting category-wise products",
                error: error.message
            }
        };
    }
};
