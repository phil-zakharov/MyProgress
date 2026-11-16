# AGENTS.md

Файл для AI-агентов, работающих с этим репозиторием. Проект на ранней стадии: многое из описанного ниже — план, а не готовый код. Проверяйте фактическое состояние файлов, прежде чем полагаться на план.

## Обзор проекта

MyProgress — приложение для отслеживания прогресса в поставленных целях (трекер целей, активностей, планов и таймера).

Монорепозиторий, но **без корневого package.json и без workspace-инструмента** (ни npm/pnpm workspaces, ни Turborepo). У `apps/api` и `apps/web` — независимые npm-проекты со своими `package-lock.json`; зависимости ставятся и скрипты запускаются отдельно в каждом из них. Каждая часть документируется сама: в `apps/api/AGENTS.md` и `apps/web/AGENTS.md` есть важные правила, специфичные для этих приложений (их содержимое следует сохранять и учитывать при работе внутри соответствующих директорий).

## Структура репозитория

```
apps/
  web/                  Next.js 16 (фронтенд)
  api/                  NestJS 12 (BFF, пока только шаблон)
services/
  tracker/              Go (планируется основной бэкенд; сейчас только main.go с "hello world")
packages/
  contracts/            Пусто. План: OpenAPI-спецификация и сгенерированные TS-типы
infra/                  Пусто. План: docker-compose.yml
README.md               Описание проекта и целевая структура (на русском)
```

Целевая структура `services/tracker` согласно README: `internal/{auth, activities, plans, timer, goals, stats}` и `migrations/`. На момент написания файла ни один из этих пакетов не создан, `go.mod` отсутствует.

## Стек и команды

### apps/web (Next.js 16.4.6, React 19, TypeScript 5)

- `npm run dev` — dev-сервер (Turbopack); `npm run build` / `npm start` — сборка и запуск.
- `npm run lint` — ESLint 9 (flat config: `eslint-config-next` + `eslint-plugin-storybook`).
- `npm run storybook` — Storybook 10 на порту 6006 (`build-storybook` — сборка).
- `npm run test` — нет такого скрипта; тесты настроены через `vitest.config.ts` (запуск: `npx vitest`), но пока в режиме Storybook-тестов: `@storybook/addon-vitest` + `@vitest/browser-playwright` (Chromium, headless). Отдельных тестов вне сторис пока нет.
- App Router: страницы и layout в `app/`. Глобальный layout — `app/layout.tsx` (`lang="ru"`, шрифт Inter с кириллическим подмножеством из `src/styles/font.ts`).
- Стили: SCSS. Глобальные — `src/styles/index.scss` (подключает `globals.scss` и `reset.scss`), палитра и переменные — `src/styles/variables.module.scss`, который автоматически инжектится в каждый SCSS-файл через `sassOptions.additionalData` в `next.config.ts`. Компонентные стили — CSS-модули (`Button.module.scss`), паттерн компонента — именованный экспорт + `interface Props` (`src/shared/ui/button/Button.tsx`).
- Shared UI-компоненты живут в `src/shared/ui/<name>/`; правила их создания (структура, пропсы, переменные, сторисы, проверки) — в разделе «Shared UI компоненты» в `apps/web/AGENTS.md`.
- В `next.config.ts` включены `cacheComponents`, `partialPrefetching`, экспериментальный `agentFeedback` — новые/нестабильные флаги Next 16.
- Псевдоним пути `@/*` указывает на корень `apps/web` (`tsconfig.json`).

### apps/api (NestJS 12, Node.js, TypeScript 6)

- Проект **ESM** (`"type": "module"`): относительные импорты заканчиваются на `.js`, `__dirname` недоступен (используйте `import.meta.dirname`). Точка входа — `src/main.ts`, порт — `process.env.PORT ?? 3000`.
- `npm run start:dev` — watch-режим; `npm run build` (nest build) → `npm run start:prod` (`node dist/main`).
- `npm run test` — Vitest 4 (unit, файлы `*.spec.ts`); `npm run test:e2e` — Vitest с `vitest.config.e2e.ts` (файлы `*.e2e-spec.ts`, supertest); `npm run test:cov` — покрытие. Глобалы тестов включены (`describe`/`it`/`vi` без импорта).
- `npm run lint` — oxlint с type-aware правилами (`.oxlintrc.json`: `no-floating-promises` — ошибка, `no-explicit-any` — выключен). `npm run format` — Prettier (`singleQuote`, `trailingComma: "all"`).
- Наблюдаемость: `@nestjs/observe` (трейсы, логи, метрики). Ключи — `OBSERVE_APP_KEY` / `OBSERVE_APP_SECRET` из `.env` (пишутся командой `npx @nestjs/observe link`). Детали — в `apps/api/AGENTS.md`.
- Важно: версия NestJS новее известной по обучающим данным; есть особенности (Standard Schema для валидации, ESM-only пакеты и пр.). Перед изменениями читайте `apps/api/AGENTS.md` и документацию по ссылкам оттуда.

### services/tracker (Go)

- Сейчас содержит только `main.go` (hello world). Файлов `go.mod`, тестов и конфигурации нет — при начале разработки всё нужно будет создать (структура планируется по `internal/`-соглашению Go, см. README).

## Конвенции

- Вся документация и комментарии проекта — на русском; отвечайте и пишите документацию на русском.
- Единый стиль форматирования в api — Prettier (см. `.prettierrc`); в web — ESLint flat config + стандартный стиль create-next-app.
- Сторонние зависимости добавляются локально в конкретное приложение, а не в корень.
- `apps/web/AGENTS.md` содержит блок «This is NOT the Next.js you know», который `next dev` пересоздаёт автоматически — не удаляйте его из рабочего дерева, иначе изменение появится снова как uncommitted.

## Тестирование

- api: unit — `*.spec.ts` рядом с кодом (`src/app.controller.spec.ts` — образец); e2e — `test/*.e2e-spec.ts` через supertest. Запуск — `npm run test` / `npm run test:e2e` из `apps/api`.
- web: единственный настроенный прогон — браузерные тесты сторис через Vitest (`npx vitest` из `apps/web`, требует установленный Playwright/Chromium). Отдельных unit-тестов пока нет.
- tracker и packages/contracts: тестов нет.

## Деплой и инфраструктура

- CI/CD, Dockerfile'ы и корневые скрипты сборки отсутствуют. Планируется `infra/docker-compose.yml` (директория пока пуста).
- В `apps/api/package.json` есть скрипт `deploy` (`nest deploy`) и dev-зависимость `@nestjs/mau` — задел под деплой на платформу Mau (AWS), но настройки деплоя нет.
- Секреты (ключи Observe) хранятся в `.env` внутри `apps/api` (файл не закоммичен). Новые секреты — только через переменные окружения / `.env`, не в коде.

## Что ещё не сделано (не считать готовым)

- Бизнес-логика отсутствует: api — шаблон Nest, tracker — hello world, web — демо-страница с одной кнопкой.
- `packages/contracts` и `infra` пусты; интеграция фронта с api не настроена.
- README описывает целевую архитектуру — сверяйтесь с фактическим кодом.
