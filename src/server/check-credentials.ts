import sha256 from "crypto-js/sha256";
import { omit } from "lodash";
import { prisma } from "./db";

const hashPassword = (password: string) => {
  return sha256(password).toString();
};

export async function checkCredentials ({ email, password } : { email: string, password: string }) {
  console.log('Checking credentials')
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
    },
  });
  if (user && user.password == hashPassword(password)) {
    return omit(user, "password") as typeof user;
  } else {
    throw new Error("Invalid credentials");
  }
}