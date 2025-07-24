import { NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Configure the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  try {
    const { movieId, status } = await request.json();

    if (!movieId || !status || !['AVAILABLE', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid input provided.' }, { status: 400 });
    }

    const command = new UpdateCommand({
      TableName: "wanzami-movies",
      Key: {
        id: movieId,
      },
      UpdateExpression: "set #statusAttribute = :statusValue",
      ExpressionAttributeNames: {
        "#statusAttribute": "status",
      },
      ExpressionAttributeValues: {
        ":statusValue": status,
      },
      ReturnValues: "UPDATED_NEW",
    });

    await docClient.send(command);

    return NextResponse.json({ message: `Successfully updated status to ${status}` });

  } catch (error) {
    console.error("ARCHIVE API ERROR:", error);
    // Log the detailed error on the server
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ details: `Failed to update status. Server error: ${errorMessage}` }, { status: 500 });
  }
}
