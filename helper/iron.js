import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
    cookieName: "kos9h487f9y7fwef4u8",
    password: String(process.env.IRON_SESSION_PASSWORD),
    cookieOptions: {
        secure: true
    }
}

export function withSessionRoute(handler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
    return withIronSessionSsr(handler, sessionOptions);
}