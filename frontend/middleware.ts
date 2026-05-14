import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// decode + check exp
function decodeJWT(token: string) {
    try {
        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );

        if (!payload.exp) return null;

        const now = Date.now() / 1000;
        if (payload.exp < now) return null;

        return payload;
    } catch {
        return null;
    }
}

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // cho login đi qua
    if (pathname === "/login") {
        return NextResponse.next();
    }

    const protectedRoutes = [
        "/dashboard",
        "/students",
        "/admin",
        "/payments",
    ];

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    let user: any = null;

    if (token && token.includes(".")) {
        user = decodeJWT(token);
    }

    // ❌ chưa login hoặc token sai
    if (isProtected && !user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = user?.role;

    // 🔥 QUAN TRỌNG NHẤT: ADMIN PASS ALL
    if (role === "admin") {
        return NextResponse.next();
    }

    // ❌ user thường không được vào admin
    if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ❌ chỉ accountant được vào finance
    if (
        pathname.startsWith("/admin/finance") &&
        role !== "accountant"
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};;