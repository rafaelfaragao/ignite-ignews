import { query as q } from 'faunadb'

import NextAuth from "next-auth"
import Providers from "next-auth/providers"

import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const {email} = user
      
      try {
        await fauna.query(
          q.If( // SE (Condição, TRUE, FALSE)
            q.Not( // CONDIÇÂO
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ), // fim da condição, primeira virgula
            q.Create( // TRUE
              q.Collection('users'),
              {data: {email}}
            ), // segunda virgula
            q.Get( // FALSE
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        );
        return true;

      } catch (error){
        console.log(error);
        return false;
      }

    },
  }
})