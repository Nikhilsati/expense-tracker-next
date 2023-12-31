import GoogleProvider from "next-auth/providers/google";
import NextAuth, { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: "none",
      // @ts-ignore
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?hd=company.com",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
