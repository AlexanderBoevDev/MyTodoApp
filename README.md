# My Todo App

Добро пожаловать в репозиторий **My Todo App** — это учебный проект на **Next.js** (App Router), где реализованы страницы регистрации / логина (NextAuth), а также база данных MySQL с помощью **Prisma**. Ниже описано, как запустить проект локально и кратко разъясняется структура проекта.

---

## 1. Как запустить проект

### 1.1 Установите зависимости
В корне проекта (где лежит `package.json`) выполните:
```bash
npm install
# или
yarn install
# или
pnpm install
# или
bun install
```
Любой удобный пакетный менеджер.

1.2 Настройте базу данных (MySQL)
Установите / запустите MySQL-сервер (например, локально).

Создайте базу данных для проекта. Например:

```
CREATE DATABASE mytodoapp;
```
В файле .env (в корне проекта) пропишите DATABASE_URL (и другие переменные) по примеру:

```
# Пример для MySQL
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/mytodoapp"

# URL приложения (если локально — http://localhost:3000)
NEXTAUTH_URL="http://localhost:3000"

# Секретный ключ (используйте любой случайный base64)
NEXTAUTH_SECRET="some_long_random_string"
```

Где:

USER и PASSWORD — логин и пароль от MySQL,
localhost или ваш хост,
3306 (порт MySQL),
mytodoapp — название базы.

1.3 Примените миграции Prisma
Выполните команду:

```
npx prisma migrate dev
(или yarn prisma migrate dev), чтобы создать таблицы в базе, согласно schema.prisma.
```

1.4 Запустите приложение
Для запуска проекта в режиме продакшене:

```
npm run build
npm run start
# или
yarn build
yarn start
# или
pnpm build
pnpm start
# или
bun build
bun start
```

Для запуска проекта в режиме разработчика:
```
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```

Откройте http://localhost:3000, чтобы увидеть проект в браузере.

2. Структура проекта

```txt
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
```

Ключевые моменты
app/(auth)/login/page.tsx: Страница «Вход».
app/(auth)/signup/page.tsx: Страница «Регистрация».
app/tasks/page.tsx: UI для просмотра/создания/фильтрации задач.
app/api/tasks/route.ts: Эндпоинты GET/POST задач (создание, получение списка).
app/api/tasks/[id]/route.ts: Эндпоинты PUT/DELETE для конкретной задачи.
app/api/auth/[...nextauth]/route.ts: Настройка NextAuth (логин, JWT).
app/api/auth/signup/route.ts: Регистрация (POST).

3. О переменных окружения
В .env должны быть, например:

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/mytodoapp"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="случайная_строка_из_openssl_rand_base64_32"
Внимание: Не коммитьте .env с реальными паролями в публичные репозитории.
```

4. Дополнительные команды
npx prisma studio — UI-режим просмотра/редактирования данных в БД.
npm run build — сборка приложения Next.js в продакшен.
npm start — запуск в продакшене (предварительно выполните npm run build).
5. Примечания
Для стилизации используется Tailwind CSS (см. tailwind.config.ts и styles/globals.css).
Для UI-компонентов — NextUI (v2).
Авторизация: NextAuth (Credendials-провайдер + JWT).
База данных: MySQL (или совместимые форки) через Prisma ORM.