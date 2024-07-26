const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { id } = event 

    if (!id) {
        return {
            statusCode: 400,
            body: {
                success: false,
                message: 'Product ID is required',
            },
        };
    }

    const params = {
        TableName: 'Product',
        Key: {
            id: id, 
        },
        // ProjectionExpression: 'id, #name, #category, #category, imageUrl, price, quantity', 
        // ExpressionAttributeNames: {
        //     '#name': 'name', 
        //     '#category': 'category', 
        //     'category':''
        // },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                body: {
                    success: false,
                    message: 'Product not found',
                },
            };
        }

        return {
            statusCode: 200,
            body: {
                success: true,
                message: 'Received single product',
                product: result.Item,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return {
            statusCode: 500,
            body: {
                success: false,
                message: 'Error while getting single product',
                error: error.message,
            },
        };
    }
};
