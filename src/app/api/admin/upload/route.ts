/*
 * FILE: src/app/api/admin/upload/route.ts
 *
 * INSTRUCTIONS: This is the complete and corrected API route. It now uses
 * the correct `getSignedUrl` method for generating pre-signed PUT URLs,
 * and fixes a bug where topCast data was being overwritten.
 */
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

// --- AWS Clients Initialization ---
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = "wanzami-movies";

// --- Helper Function to handle both POST and PUT requests ---
async function handleRequest(request: Request) {
    const {
        id, title, description, genres, contentType, topCast, files, secretKey
    } = await request.json();

    // --- Security Check ---
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // --- Prepare File Paths and Pre-signed URLs ---
    const filePaths: {
        imgSrc?: string;
        backdropSrc?: string;
        trailerSrc?: string;
        mainSrc: string | string[];
        topCast: { name: string; imgSrc?: string }[];
    } = {
        mainSrc: contentType === 'series' ? [] : '',
        topCast: []
    };
    
    const presignedUrls: { [key: string]: string } = {};

    const promises = files.map(async (file: { name: string; type: string; category: string }) => {
        const keyPath = `content/${id}/${file.category}/${file.name.replace(/\s/g, '_')}`;
        
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: keyPath,
            ContentType: file.type,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
        presignedUrls[file.category] = signedUrl;

        // Populate filePaths for database entry
        if (file.category === 'poster') filePaths.imgSrc = keyPath;
        else if (file.category === 'backdrop') filePaths.backdropSrc = keyPath;
        else if (file.category === 'trailer') filePaths.trailerSrc = keyPath;
        else if (file.category.startsWith('main')) {
            if (Array.isArray(filePaths.mainSrc)) {
                filePaths.mainSrc.push(keyPath);
            } else {
                filePaths.mainSrc = keyPath;
            }
        } else if (file.category.startsWith('cast')) {
            const index = parseInt(file.category.split('-')[1], 10);
            while (filePaths.topCast.length <= index) {
                filePaths.topCast.push({ name: '', imgSrc: '' });
            }
            filePaths.topCast[index] = { ...filePaths.topCast[index], imgSrc: keyPath };
        }
    });

    await Promise.all(promises);
    
    const finalCast = topCast.map((castMember: { name: string, hasPicture: boolean }, index: number) => {
        const castPictureData = filePaths.topCast[index];
        return {
            name: castMember.name,
            imgSrc: castPictureData?.imgSrc || ''
        };
    });

    // --- Database Operation ---
    if (request.method === 'POST') {
        // Correctly exclude topCast from filePaths before spreading
        const { topCast: _, ...otherFilePaths } = filePaths; 
        const itemToCreate = {
            id, title, description, genres, contentType,
            topCast: finalCast,
            status: 'PENDING_UPLOAD',
            ...otherFilePaths
        };
        const putCommand = new PutCommand({
            TableName: TABLE_NAME,
            Item: itemToCreate,
        });
        await docClient.send(putCommand);

    } else if (request.method === 'PUT') {
        const getCommand = new GetCommand({ TableName: TABLE_NAME, Key: { id } });
        const { Item: existingItem } = await docClient.send(getCommand);

        const updateData: { [key: string]: any } = {
            title, description, genres, contentType,
            imgSrc: filePaths.imgSrc || existingItem?.imgSrc,
            backdropSrc: filePaths.backdropSrc || existingItem?.backdropSrc,
            trailerSrc: filePaths.trailerSrc || existingItem?.trailerSrc,
            mainSrc: (Array.isArray(filePaths.mainSrc) && filePaths.mainSrc.length > 0) || (typeof filePaths.mainSrc === 'string' && filePaths.mainSrc) ? filePaths.mainSrc : existingItem?.mainSrc,
            topCast: finalCast.length > 0 ? finalCast.map((newCast: { name: string, imgSrc: string }, index: number) => ({
                name: newCast.name || existingItem?.topCast?.[index]?.name,
                imgSrc: newCast.imgSrc || existingItem?.topCast?.[index]?.imgSrc || ''
            })) : existingItem?.topCast
        };
        
        const updateExpressionParts: string[] = [];
        const expressionAttributeValues: { [key: string]: any } = {};
        const expressionAttributeNames: { [key: string]: any } = {};

        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && ( (Array.isArray(value) && value.length > 0) || !Array.isArray(value) ) ) {
                updateExpressionParts.push(`#${key} = :${key}`);
                expressionAttributeValues[`:${key}`] = value;
                expressionAttributeNames[`#${key}`] = key;
            }
        });
        
        if (updateExpressionParts.length > 0) {
            const updateCommand = new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id },
                UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
                ExpressionAttributeValues: expressionAttributeValues,
                ExpressionAttributeNames: expressionAttributeNames,
            });
            await docClient.send(updateCommand);
        }
    }

    return NextResponse.json({ signedUrls: presignedUrls });
}

export { handleRequest as POST, handleRequest as PUT };
