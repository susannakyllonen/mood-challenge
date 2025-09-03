# Mood Journal Challenge

## Setup

- Tech stack: Next.js, TypeScript, styled-components
- Data layer: No backend, no database. Persist locally with localStorage
- Install & run
  - Clone the repo - git clone
  - npm install
  - npm run dev

## MVP Features

- Log your daily mood either by different colors or emojis
- Add optional short note (up to 200 characters)
- One mood per day editing allowed
- See history (30 days)
- Track progress - days logged out of 30
- Track streak

## Architecture / Design choises

- Styling with styled-components
- Single page app: Add today's mood (1-5 emoji picture) + optional note, see history below
- One entry per day, saving again overwrites the existing entry

## Improvements if more time

- Charts about how are we doing
- Suggestions based on charts - how to improve your mood or just cheering
