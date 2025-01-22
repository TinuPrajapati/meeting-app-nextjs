import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export const middleware = async (req) => {
    const token =await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    console.log("token"+token)
    if (req.nextUrl.pathname == "/user-auth" && token) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // User tries to access home page without login
    if (!token && req.nextUrl.pathname !== "/user-auth") {
        return NextResponse.redirect(new URL("/user-auth", req.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/user-auth"]
}
