## Запуск проекта

Выполнить команды:

```bash
npm run install
npm run dev
# or
yarn install
yarn dev
```

## Структура проекта

my-todo-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── tasks/
│   │   ├── page.tsx             // Основная страница для работы с задачами (UI)
│   ├── layout.tsx               // Корневой layout для App Router
│   ├── page.tsx                 // Главная страница (HomePage)
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts    // NextAuth конфигурация (логин)
│       │   └── signup/route.ts           // Маршрут для POST: регистрация
│       └── tasks/
│           ├── route.ts                  // GET/POST задачи
│           └── [id]/route.ts             // PUT/DELETE задачи
├── prisma/
│   ├── schema.prisma           // Описание схемы БД (MySQL)
│   └── migrations/             // Папка с миграциями Prisma
├── public/
│   └── favicon.ico
├── styles/
│   └── globals.css             // Глобальные стили (Tailwind)
├── .env                        // Ваши секретные переменные окружения (DATABASE_URL, NEXTAUTH_SECRET и т.д.)
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md                   // Файл с инструкциями
