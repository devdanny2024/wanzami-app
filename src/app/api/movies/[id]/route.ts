import { NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

// This function handles GET requests to /api/movies/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // `params` is a promise
) {
  try {
    // As per Next.js 15, we must `await` the params object.
    const { id } = await params;
    const command = new GetCommand({
      TableName: "wanzami-movies",
      Key: { id },
    });

    const { Item } = await docClient.send(command);

    if (!Item) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(Item);
  } catch (error) {
    console.error("Error fetching single movie:", error);
    return NextResponse.json(
      { details: "Failed to fetch movie data." },
      { status: 500 }
    );
  }
}