import { NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// --- AWS Clients Initialization ---
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = "wanzami-movies";

export async function POST(request: Request) {
    try {
        const { contentId, secretKey } = await request.json();

        // --- Security Check ---
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!contentId) {
            return NextResponse.json({ details: 'Content ID is required.' }, { status: 400 });
        }
        
        // --- Database Operation ---
        // Update the status of the movie from 'PENDING_UPLOAD' to 'AVAILABLE'
        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: contentId },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: { ":status": "AVAILABLE" },
        });

        await docClient.send(command);

        return NextResponse.json({ success: true, message: `Content ${contentId} finalized.` });

    } catch (error) {
        console.error("Finalization API Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ details: `Server error: ${errorMessage}` }, { status: 500 });
    }
}