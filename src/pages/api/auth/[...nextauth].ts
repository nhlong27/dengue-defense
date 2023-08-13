import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { decode, encode } from "next-auth/jwt";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { SHA256 } from "crypto-js";

export const authOptionsWrapper = (req: NextApiRequest, res: NextApiResponse) => [
  req,
  res,
  {
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        // authorization: { params: { access_type: 'offline', prompt: 'consent' } },
        // profile(profile) {
        //   const user = signInWithOAuth(profile);
        //   return user as any;
        // },
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
          const { email, password } = credentials;

          try {
            if (!isEmail(email as string)) {
              throw new Error("Email should be a valid email address");
            }

            const user = await prisma.user.findUnique({
              where: {
                email,
              },
            });

            if (!user) {
              throw new Error("User account does not exist");
            }

            // if (!user.active) {
            //   throw new Error(
            //     "This account is temporarily disabled, please contact customer service"
            //   );
            // }

            const passwordsMatch = await bcrypt.compare(
              password as string,
              user.password!
            );

            if (!(user.password == SHA256(password as string).toString())) {
              throw new Error("Password is not correct");
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          } catch (error) {
            console.error(error.message);

            if (
              error instanceof Prisma.PrismaClientInitializationError ||
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              throw new Error(
                "System error. Please contact support@---.io"
              );
            }

            throw error;
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user }) {
        console.log({user})
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = randomUUID();
            const sessionExpiry = new Date(
              Date.now() + 60 * 60 * 24 * 30 * 1000
            ); // 30 days

            await prisma.session.create({
              data: {
                sessionToken: sessionToken,
                userId: user.id,
                expires: sessionExpiry,
              },
            });

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }

        return true;
      },
    },
    secret: process.env.AUTH_SECRET,
    jwt: {
      maxAge: 60 * 60 * 24 * 30, 
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");

          if (cookie) return cookie;
          return "";
        }

        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }
        return decode({ token, secret });
      },
    },
    adapter: PrismaAdapter(prisma),
    debug: process.env.NODE_ENV === "development",
    events: {
      async signOut({ session }) {
        const { sessionToken } = session;

        const data = await prisma.session.findUnique({
          where: {
            sessionToken,
          },
        });

        if (data) {
          await prisma.session.delete({
            where: {
              sessionToken,
            },
          });
        }
      },
    },
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(...authOptionsWrapper(req, res))
}