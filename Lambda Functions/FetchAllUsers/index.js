const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');


const dynamoClient = new DynamoDBClient({ region: 'us-east-1' }); 

exports.handler = async (event) => {
    try {
        const params = {
            TableName: 'Users',     
        };

        // Execute the ScanCommand
        const data = await dynamoClient.send(new ScanCommand(params));

        // Process the data
        const users = data.Items.map(item => unmarshall(item));

        return {
            body: {
                success: true,
                message: 'All Users',
                totalCount: users.length,
                users
            },
        };

    } catch (error) {
        console.error(error);
        return {
           body:  {
                success: false,
                message: 'Error while getting Users',
                error: error.message
            },
        };
    }
};
