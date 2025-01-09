import { DefaultSession } from "next-auth";

// Расширяем типы внутри модуля "next-auth"
declare module "next-auth" {
  // Если возвращаем из authorize() объект { id, email },
  // то тут мы описываем, какие поля доступны у session.user
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}
