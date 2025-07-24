
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, DeleteObjectsCommand, ObjectIdentifier } from "@aws-sdk/client-s3"; // Correct type imported

const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);
const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function POST(request: Request) {
  try {
    const { movieId, adminPassword } = await request.json();

    // 1. Verify Admin Password
    if (adminPassword !== process.env.ADMIN_DELETE_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized", details: "Incorrect admin password." }, { status: 401 });
    }

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
    }

    // 2. Get the movie item from DynamoDB to find all associated file paths
    const getCommand = new GetCommand({
      TableName: "wanzami-movies",
      Key: { id: movieId },
    });
    const { Item: movie } = await docClient.send(getCommand);

    if (!movie) {
      return NextResponse.json({ error: "Not Found", details: "Movie not found in the database." }, { status: 404 });
    }

    // 3. Collect all S3 object keys to be deleted
    const objectsToDelete: ObjectIdentifier[] = []; // Using the correct ObjectIdentifier type
    const fileKeys = ['poster', 'backdrop', 'trailer', 'main'];
    
    fileKeys.forEach(key => {
        if (movie[key]) {
            if (Array.isArray(movie[key])) { // Handle multiple main files for series
                movie[key].forEach((path: string) => objectsToDelete.push({ Key: path }));
            } else {
                objectsToDelete.push({ Key: movie[key] });
            }
        }
    });

    if (movie.topCast && Array.isArray(movie.topCast)) {
        movie.topCast.forEach((cast: { imgSrc: string }) => {
            if (cast.imgSrc) {
                objectsToDelete.push({ Key: cast.imgSrc });
            }
        });
    }

    // 4. Delete objects from S3 if there are any
    if (objectsToDelete.length > 0) {
      const deleteS3Command = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
          Objects: objectsToDelete,
        },
      });
      await s3Client.send(deleteS3Command);
    }

    // 5. Delete the item from DynamoDB
    const deleteDbCommand = new DeleteCommand({
      TableName: "wanzami-movies",
      Key: { id: movieId },
    });
    await docClient.send(deleteDbCommand);

    return NextResponse.json({ message: "Content deleted successfully." });

  } catch (error) {
    console.error("Delete Content Error:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { error: "Failed to delete content", details: errorMessage },
      { status: 500 }
    );
  }
}
