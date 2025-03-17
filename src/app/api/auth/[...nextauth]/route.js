import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          if (user.isBlocked) {
            throw new Error('Your account has been blocked.');
          }
          return { id: user._id, name: user.name, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            provider: 'google',
            role: 'user',
          });
          await newUser.save();
        } else if (existingUser.isBlocked) {
          throw new Error('Your account has been blocked.');
        }
      }
      return true; // Allow sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login', // Custom sign-in page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };