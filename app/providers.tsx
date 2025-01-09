"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
};

/**
 * Общий провайдер, который:
 * 1) Даёт контекст сессий (NextAuth).
 * 2) Включает библиотеку next-themes (переключение тем).
 * 3) NextUIProvider (компоненты NextUI).
 */
export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
      >
        <NextUIProvider>{children}</NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
