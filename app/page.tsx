"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { status } = useSession();

  // Проверяем, авторизован ли пользователь
  const isAuthenticated = status === "authenticated";

  return (
    <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
        >
          <circle
            r={512}
            cx={512}
            cy={512}
            fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Повысьте свою производительность.
          </h2>
          <p className="mt-6 text-pretty text-lg/8 text-gray-300">
            Начните пользоваться нашим приложением уже сегодня.
          </p>
          <div className="mb-10 md:mb-4 mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            {isAuthenticated ? (
              <Link
                href="/tasks"
                className="text-sm/6 font-semibold text-white"
              >
                Мои задачи <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Вход
                </Link>
                <Link
                  href="/signup"
                  className="text-sm/6 font-semibold text-white"
                >
                  Начать пользоваться <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
