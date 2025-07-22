/*
 * FILE: src/lib/auth.ts
 *
 * INSTRUCTIONS: This file has been updated with a new function, `updateUserAttributes`,
 * to save changes to a user's profile in AWS Cognito.
 */
import { cookies } from 'next/headers';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  UpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export async function getUserSession() {
  const cookieStore = await cookies(); 
  const idToken = cookieStore.get('IdToken');
  const isLoggedIn = !!idToken;
  return { isLoggedIn };
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('AccessToken')?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const command = new GetUserCommand({ AccessToken: accessToken });
        const response = await cognitoClient.send(command);
        
        const user = {
            username: response.Username,
            email: response.UserAttributes?.find(attr => attr.Name === 'email')?.Value,
            preferred_username: response.UserAttributes?.find(attr => attr.Name === 'preferred_username')?.Value,
            picture: response.UserAttributes?.find(attr => attr.Name === 'picture')?.Value,
        };

        return user;

    } catch (error) {
        console.error("Failed to get user:", error);
        return null;
    }
}

export async function updateUserAttributes(attributes: { Name: string; Value: string }[]) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('AccessToken')?.value;

    if (!accessToken) {
        throw new Error("Not authenticated");
    }

    const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: attributes,
    });

    await cognitoClient.send(command);
}
