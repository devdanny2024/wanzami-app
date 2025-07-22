import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
    if (!COGNITO_CLIENT_ID) {
      throw new Error("Cognito Client ID is not configured.");
    }

    const command = new ConfirmSignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });

    await cognitoClient.send(command);

    return NextResponse.json(
      { message: "Account verified successfully." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Verification Error:", error);
    
    const errorMessage = error.name || "An unexpected error occurred.";
    const statusCode = error.$metadata?.httpStatusCode || 500;

    return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
  }
}