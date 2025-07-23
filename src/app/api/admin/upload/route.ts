import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// Initialize AWS Clients
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

// Define the expected structure of the request body
interface UploadRequestBody {
    title: string;
    description: string;
    genres: string;
    contentType: 'movie' | 'series';
    files: {
        key: 'poster' | 'backdrop' | 'trailer' | 'main';
        name: string;
        type: string;
    }[];
}

export async function POST(request: Request) {
    try {
        const body: UploadRequestBody = await request.json();
        const { title, description, genres, contentType, files } = body;

        // Generate a unique ID for this new piece of content
        const contentId = randomUUID();

        // --- Step 1: Generate Pre-signed URLs for S3 Upload ---
        const signedUrls = await Promise.all(
            files.map(async (file) => {
                const command = new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    // Create a unique key for each file in S3
                    Key: `content/${contentId}/${file.key}/${file.name}`,
                    ContentType: file.type,
                });

                const signedUrl = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600, // URL expires in 1 hour
                });

                return {
                    key: file.key,
                    url: signedUrl,
                };
            })
        );

        // --- Step 2: Save Initial Metadata to DynamoDB ---
        const fileLocations = files.reduce((acc, file) => {
            acc[file.key] = `content/${contentId}/${file.key}/${file.name}`;
            return acc;
        }, {} as Record<string, string>);

        const dbCommand = new PutCommand({
            TableName: "wanzami-movies",
            Item: {
                id: contentId,
                title,
                description,
                genres: genres.split(',').map(g => g.trim()), // Save genres as a list
                contentType,
                ...fileLocations,
                createdAt: new Date().toISOString(),
                status: 'PENDING_UPLOAD', // Mark as pending until files are uploaded
            },
        });

        await docClient.send(dbCommand);

        // --- Step 3: Return URLs to the Frontend ---
        return NextResponse.json({
            message: "Successfully initiated upload.",
            contentId,
            signedUrls,
        });

    } catch (error) {
        console.error("Upload Initiation Error:", error);
        const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
        return NextResponse.json(
            { error: "Failed to initiate upload", details: errorMessage },
            { status: 500 }
        );
    }
}
