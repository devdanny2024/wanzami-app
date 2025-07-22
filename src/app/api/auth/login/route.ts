import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { serialize } from 'cookie';

// Initialize the Cognito Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
    if (!COGNITO_CLIENT_ID) {
      throw new Error("Cognito Client ID is not configured.");
    }

    // Prepare the command to send to Cognito
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    // Send the command to Cognito
    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
        throw new Error("Authentication failed. Please check your credentials.");
    }

    // --- Set Cookies ---
    const accessToken = AuthenticationResult.AccessToken;
    const idToken = AuthenticationResult.IdToken;
    const refreshToken = AuthenticationResult.RefreshToken;

    const accessTokenCookie = serialize('AccessToken', accessToken || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: AuthenticationResult.ExpiresIn, // ExpiresIn is in seconds
    });

    const idTokenCookie = serialize('IdToken', idToken || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: AuthenticationResult.ExpiresIn,
    });
    
    const headers = new Headers();
    headers.append('Set-Cookie', accessTokenCookie);
    headers.append('Set-Cookie', idTokenCookie);

    // The refresh token is typically stored more securely or with a longer expiry
    if (refreshToken) {
        const refreshTokenCookie = serialize('RefreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });
        headers.append('Set-Cookie', refreshTokenCookie);
    }

    return new NextResponse(JSON.stringify({ message: "Login successful" }), {
        status: 200,
        headers: headers,
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    
    const errorMessage = error.name || "An unexpected error occurred.";
    const statusCode = error.$metadata?.httpStatusCode || 500;

    return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
  }
}
