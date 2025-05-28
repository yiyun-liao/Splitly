    import { NextRequest, NextResponse } from "next/server";

    export async function GET(req: NextRequest) {
    const uid = req.nextUrl.searchParams.get("uid");
    const token = req.headers.get("Authorization");

    console.log(token)
    if (!uid || !token) {
        return NextResponse.json({ error: "Missing uid or token" }, { status: 400 });
    }

    try {
        const res = await fetch(`http://127.0.0.1:8000/api/auth/getUser?uid=${uid}`, {
        method: "GET",
        headers: {
            Authorization: token,
        },
        });

        const data = await res.json();

        if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    }
