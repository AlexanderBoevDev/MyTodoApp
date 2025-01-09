"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import ThemeSwitcher from "@/app/theme-switcher";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavBar() {
  const { status } = useSession();

  // Пользователь авторизован, если статус === "authenticated"
  const isAuthenticated = status === "authenticated";

  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand>
          <Link href="/">
            <AcmeLogo />
            <p className="font-bold text-inherit">{"i'm"} ToDo</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <div className="flex gap-2 items-center">
          {isAuthenticated && (
            <NavbarItem>
              <Button
                as={Link}
                variant="flat"
                onClick={() => signOut()}
                className="bg-black text-white dark:bg-zinc-700 dark:text-white"
              >
                Выход
              </Button>
            </NavbarItem>
          )}
          <ThemeSwitcher />
        </div>
      </NavbarContent>
    </Navbar>
  );
}
