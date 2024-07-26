const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({ region: 'us-east-1' });
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (!event) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is missing" }),
    };
  }

  let formData;
  try {
    formData = event;
  } catch (parseError) {
    console.error("Error parsing request body:", parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON format" }),
    };
  }

  console.log("Parsed formData:", formData);

  try {
    const { name, description, price, category, quantity, image } = formData;

    if (!name || !description || !price || !quantity || !image || !category) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required!" }),
      };
    }

    const imageData = image.split(';base64,').pop();
    const imageBuffer = Buffer.from(imageData, 'base64');

    const imageKey = `images/${uuidv4()}`;
    const uploadParams = {
      Bucket: "productimagebk",
      Key: imageKey,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const params = {
      TableName: "Product",
      Item: {
        id: uuidv4(),
        name,
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        imageUrl: `https://productimagebk.s3.amazonaws.com/${imageKey}`,
      },
    };

    await dynamoDbClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product created successfully!' }),
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
