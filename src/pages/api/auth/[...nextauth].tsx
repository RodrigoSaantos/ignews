import NextAuth from 'next-auth';
import GithubProvider from "next-auth/providers/github";
import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: "https://github.com/login/oauth/authorize?scope=read:user"
    }),
  ],

  jwt: {
    signingKey: process.env.SIGNING_KEY,
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;

      try {
        await fauna.query(q.Create(q.Collection('users'), { data: { email } }));

        return true;
      } catch {
        return false;
      }
    },
  },
});