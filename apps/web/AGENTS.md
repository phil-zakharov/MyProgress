<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Shared UI компоненты (`src/shared/ui`)

Правила создания новых shared-компонентов (образец — `src/shared/ui/button`, `src/shared/ui/badge`):

- Структура: директория в нижнем регистре `src/shared/ui/<name>/` с файлами `<Name>.tsx`, `<Name>.module.scss`, `<Name>.stories.tsx`.
- Компонент — именованный экспорт (`export const Badge = ...`), пропсы — `interface Props`. Если компонент принимает контент, `Props` расширяет `PropsWithChildren`; для нативных элементов — соответствующие HTML-атрибуты (см. `Button`).
- Текст и контент прокидываются потребителем через `children` — подписи внутрь компонента не зашивать. Оформление задаётся пропом-вариантом (`status`, `variant`) через мапу `значение → styles.<класс>`.
- Стили — CSS-модуль SCSS. Файл `src/styles/variables.module.scss` автоматически инжектится в каждый SCSS-файл (`sassOptions.additionalData` в `next.config.ts`), импортировать его руками не нужно.
- Цвета, радиусы, отступы — только через переменные из `variables.module.scss`. Сначала проверить существующую палитру (`$primary`, `$green`, `$amber`, `$muted`, `$bg`, `$line` и т.д.); новые семантические токены добавлять туда отдельным блоком с комментарием (`// BADGE`), по образцу блока `// BUTTONS`.
- Иконки — из `src/shared/icons`.
- Сторисы: `title: 'shared/ui/<Name>'`, `parameters.layout: 'centered'`, `tags: ['autodocs']`, `satisfies Meta<typeof Component>`, отдельная сторя на каждый вариант, подписи/контент — в `args.children`.
- Проверка после создания: `npx eslint src/shared/ui/<name>` и `npm run build` (нужен Node из `.nvmrc`: `nvm use`).
- Данные для вёрстки брать из Figma через MCP-инструменты figma (цвета сверять с палитрой, а не копировать hex вслепую).

## Storybook MCP

При работе с UI-компонентами всегда сначала обращайтесь к инструментам MCP-сервера `storybook` (Storybook MCP, `http://localhost:6006/mcp`), чтобы получить знания о компонентах и их документации, и только потом отвечайте или что-то меняйте.

- **КРИТИЧНО: не выдумывайте пропсы компонентов!** Перед использованием ЛЮБОГО пропса компонента из дизайн-системы (включая «очевидные» вроде `shadow` и т.п.) необходимо через MCP-инструменты проверить, что этот проп действительно задокументирован у компонента.
- Запрашивайте `docs-list`, чтобы получить список задокументированных компонентов.
- Запрашивайте `docs-show` для конкретного компонента, чтобы увидеть все доступные пропсы и примеры.
- Используйте только пропсы, которые явно задокументированы или показаны в примерах сторис.
- Если пропс не задокументирован, не додумывайте его по naming-конвенциям или по аналогии с другими библиотеками — в таких случаях уточняйте у пользователя.
- Используйте инструмент `get-storybook-story-instructions`, чтобы получить актуальные инструкции по созданию или обновлению сторис — это гарантирует следование текущим конвенциям и рекомендациям.
- Проверяйте результат запуском `test-run`.

Помните: имя стори может не совпадать с именем пропса — всегда проверяйте пропсы через документацию или примеры сторис перед их использованием.
