import { NextResponse as NextRes } from "next/server";
import { CognitoIdentityProviderClient as CognitoClient, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoClient({ region: process.env.AWS_REGION });

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextRes.json({ error: "Email is required" }, { status: 400 });
        }
        const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
        if (!COGNITO_CLIENT_ID) {
            throw new Error("Cognito Client ID is not configured.");
        }
        const command = new ResendConfirmationCodeCommand({
            ClientId: COGNITO_CLIENT_ID,
            Username: email,
        });
        await cognitoClient.send(command);
        return NextRes.json({ message: "Verification code resent successfully." });
    } catch (error) {
        console.error("Resend Code Error:", error);
        const errorMessage = (error instanceof Error && 'name' in error) ? (error as {name: string}).name : "An unexpected error occurred.";
        const statusCode = (error instanceof Error && '$metadata' in error) ? (error as {$metadata: {httpStatusCode?: number}}).$metadata?.httpStatusCode || 500 : 500;
        const errorDetails = (error instanceof Error) ? error.message : String(error);

        return NextRes.json({ error: errorMessage, details: errorDetails }, { status: statusCode });
    }
}
