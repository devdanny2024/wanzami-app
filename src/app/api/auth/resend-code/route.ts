import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
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
        return NextResponse.json({ message: "Verification code resent successfully." });
    } catch (error: any) {
        console.error("Resend Code Error:", error);
        const errorMessage = error.name || "An unexpected error occurred.";
        const statusCode = error.$metadata?.httpStatusCode || 500;
        return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
    }
}