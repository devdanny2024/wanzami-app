/*
 * FILE: src/app/api/auth/logout/route.ts
 *
 * INSTRUCTIONS: Create the folder structure 'src/app/api/auth/logout/'.
 * Then, create this 'route.ts' file inside it.
 *
 * This API route handles user logout by clearing the authentication cookies.
 */
import { NextResponse } from "next/server";
import { serialize } from 'cookie';

export async function POST() {
    // To log a user out, we set the cookies' maxAge to -1,
    // which tells the browser to expire them immediately.
    const accessTokenCookie = serialize('AccessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: -1,
    });

    const idTokenCookie = serialize('IdToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: -1,
    });
    
    const refreshTokenCookie = serialize('RefreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: -1,
    });

    const headers = new Headers();
    headers.append('Set-Cookie', accessTokenCookie);
    headers.append('Set-Cookie', idTokenCookie);
    headers.append('Set-Cookie', refreshTokenCookie);

    // After clearing the cookies, we can send a success response.
    // The frontend will handle the redirect.
    return new NextResponse(JSON.stringify({ message: "Logout successful" }), {
        status: 200,
        headers: headers,
    });
}
