import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    // Basic validation
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

    // Prepare the command to send to Cognito
    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email, // Cognito often uses email as the username
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "preferred_username", // This is a standard attribute for a display name
          Value: username,
        },
      ],
    });

    // Send the command to Cognito
    const response = await cognitoClient.send(command);

    // If sign-up is successful, Cognito will require the user to confirm their email.
    return NextResponse.json(
      {
        message: "User registered successfully. Please check your email to confirm your account.",
        user: response.UserSub,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration Error:", error);
    
    // Provide a more specific error message if available
    const errorMessage = error.name || "An unexpected error occurred.";
    const statusCode = error.$metadata?.httpStatusCode || 500;

    return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
  }
}
