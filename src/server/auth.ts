// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { type GetServerSidePropsContext } from "next";
// import {
//   getServerSession,
//   type NextAuthOptions,
//   type DefaultSession,
// } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
// import { env } from "@/env.mjs";
// import { prisma } from "@/server/db";
// import GoogleProvider from 'next-auth/providers/google';
// import CredentialsProvider from "next-auth/providers/credentials";
// import { checkCredentials } from "./check-credentials";

// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: DefaultSession["user"] & {
//       id: string;
//       // ...other properties
//       // role: UserRole;
//     };
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authOptions: NextAuthOptions = {
//   // callbacks: {
//   //   session: ({ session, user }) => ({
//   //     ...session,
//   //     user: {
//   //       ...session.user,
//   //       id: user.id,
//   //     },
//   //   }),
//   // },
//   adapter: PrismaAdapter(prisma),
//   secret: env.NEXTAUTH_SECRET,
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       id: "credentials",
//       name: "credentials",
//       // The credentials is used to generate a suitable form on the sign in page.
//       // You can specify whatever fields you are expecting to be submitted.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials: {
//         email: {
//           label: "Username",
//           type: "text",
//           placeholder: "jsmith",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials, req) => {
//         const user = await checkCredentials(credentials!);

//         if (user) {
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//       // authorization: { params: { access_type: 'offline', prompt: 'consent' } },
//       // profile(profile) {
//       //   const user = signInWithOAuth(profile);
//       //   return user as any;
//       // },
//     }),
//     DiscordProvider({
//       clientId: env.DISCORD_CLIENT_ID,
//       clientSecret: env.DISCORD_CLIENT_SECRET,
//     }),

//     /**
//      * ...add more providers here.
//      *
//      * Most other providers require a bit more work than the Discord provider. For example, the
//      * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
//      * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
//      *
//      * @see https://next-auth.js.org/providers/github
//      */
//   ],
//   callbacks: {
//     session({ session, user }) {
//       console.log("SESSION callback", session, user)
//       if (session.user) {
//         session.user.id = user.id
//       }
//       return session
//     },
//     async signIn({ user }) {
//       if (
//         req.query.nextauth?.includes("callback") &&
//         req.query.nextauth?.includes("credentials") &&
//         req.method === "POST"
//       ) {
//         if (user && "id" in user) {
//           const sessionToken = randomUUID()
//           const sessionExpiry = new Date(Date.now() + session.maxAge * 1000)
//           await adapter.createSession({
//             sessionToken : sessionToken,
//             userId: user.id,
//             user : {
//               name : user.name,
//               email : user.email
//             },
//             expires: sessionExpiry,
//             // userAgent: req.headers["user-agent"] ?? null,
//           })
//           const cookies = new Cookies(req, res)
//           cookies.set("next-auth.session-token", sessionToken, {
//             expires: sessionExpiry,
//           })
//         }
//       }
//       return true
//     },
//   },
  
  
//   //needs to override default jwt behavior when using Credentials 
//   jwt: {
//     encode(params) {
//       if (
//         req.query.nextauth?.includes("callback") &&
//         req.query.nextauth?.includes("credentials") &&
//         req.method === "POST"
//       ) {
//         const cookies = new Cookies(req, res)
//         const cookie = cookies.get("next-auth.session-token")
//         if (cookie) return cookie
//         else return ""
//       }
//       // Revert to default behaviour when not in the credentials provider callback flow
//       return encode(params)
//     },
//     async decode(params) {
//       if (
//         req.query.nextauth?.includes("callback") &&
//         req.query.nextauth?.includes("credentials") &&
//         req.method === "POST"
//       ) {
//         return null
//       }
//       // Revert to default behaviour when not in the credentials provider callback flow
//       return decode(params)
//     },
//   },
// };

// /**
//  * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  */
// export const getServerAuthSession = (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   return getServerSession(ctx.req, ctx.res, authOptions);
// };
