import { NextResponse } from "next/server";
import { updateUserAttributes } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { username, picture } = await request.json();

        if (!username || !picture) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await updateUserAttributes([
            { Name: 'preferred_username', Value: username },
            { Name: 'picture', Value: picture },
        ]);

        return NextResponse.json({ message: "Profile updated successfully" });

    } catch (error) {
        console.error("Update Profile Error:", error);
        const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
        return NextResponse.json({ error: "Update failed", details: errorMessage }, { status: 500 });
    }
}