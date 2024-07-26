const AWS = require('aws-sdk');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // const body = JSON.parse(event);
        const { name } = event;
        console.log("name", name);
        if (!name) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: true,
                    message: "Category Name is required!"
                })
            };
        }

        const params = {
            TableName: 'Categories',
            KeyConditionExpression: 'name = :name',
            ExpressionAttributeValues: {
                ':name': name
            }
        };

        const existingCategory = await dynamoDb.query(params).promise();
        if (existingCategory.Items.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Category Already Present!"
                })
            };
        }

        const newCategory = {
            id: uuidv4(),
            name,
            slug: slugify(name)
        };

        const putParams = {
            TableName: 'Categories',
            Item: newCategory
        };

        await dynamoDb.put(putParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "New Category Created!",
                categoryName: newCategory
            })
        };

    } catch (error) {
        console.log(error);
        return {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                message: "Error in creating Category",
                error
            })
        };
    }
};
