import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Экспортируем только валидные поля для роутов Next.js:
export { handler as GET, handler as POST };
