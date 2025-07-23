import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB Client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // Note: For this to work when deployed to Vercel, you must set up
  // AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as environment variables.
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: "wanzami-movies",
    });

    const response = await docClient.send(command);

    return NextResponse.json(response.Items);

  } catch (error) {
    console.error("DynamoDB Error:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: "Failed to fetch movies", details: errorMessage },
      { status: 500 }
    );
  }
}