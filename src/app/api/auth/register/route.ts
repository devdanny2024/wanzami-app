import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

    if (!COGNITO_CLIENT_ID) {
      throw new Error("Cognito Client ID is not configured.");
    }

    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "preferred_username",
          Value: username,
        },
      ],
    });

    const response = await cognitoClient.send(command);

    return NextResponse.json(
      {
        message: "User registered successfully. Please check your email to confirm your account.",
        user: response.UserSub,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    
    const errorMessage = (error instanceof Error && 'name' in error) ? (error as {name: string}).name : "An unexpected error occurred.";
    const statusCode = (error instanceof Error && '$metadata' in error) ? (error as {$metadata: {httpStatusCode?: number}}).$metadata?.httpStatusCode || 500 : 500;
    const errorDetails = (error instanceof Error) ? error.message : String(error);

    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: statusCode });
  }
}