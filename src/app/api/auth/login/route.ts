import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { serialize } from 'cookie';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

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

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
        throw new Error("Authentication failed. Please check your credentials.");
    }

    const accessToken = AuthenticationResult.AccessToken;
    const idToken = AuthenticationResult.IdToken;
    const refreshToken = AuthenticationResult.RefreshToken;

    const accessTokenCookie = serialize('AccessToken', accessToken || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: AuthenticationResult.ExpiresIn,
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

  } catch (error) {
    console.error("Login Error:", error);
    
    const errorMessage = (error instanceof Error && 'name' in error) ? (error as {name: string}).name : "An unexpected error occurred.";
    const statusCode = (error instanceof Error && '$metadata' in error) ? (error as {$metadata: {httpStatusCode?: number}}).$metadata?.httpStatusCode || 500 : 500;
    const errorDetails = (error instanceof Error) ? error.message : String(error);

    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: statusCode });
  }
}