# Minecrafter

A minimal Next.js 13+ app for uploading and displaying images (Cloudinary). Built with React 19, TypeScript and Tailwind.

## Quick start

1. Install
npm install

2. Add environment variables (see below)

3. Run dev server
npm run dev

Open http://localhost:3000

## Environment variables
Create a .env file (not committed) with your Cloudinary credentials:

- CLOUD_NAME
- CLOUD_KEY
- CLOUD_SECRET

These are used in the API routes:
app.api.upload.POST — upload endpoint
app.api.get-photos.GET — list images

# Project structure
## Top-level files:

.env
.gitignore
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
README.md
tsconfig.json
.next/
types/
public/img/

## App and components (primary files):

app/layout
app/page
app/globals.css
app/api/upload/route.ts
app/api/get-photos/route.ts

## UI components:

components.LenisWrapper
components.Footer
components.Hero
components.Main
components.Model
components.UploadImage
components.RecentUploads

## How it works (high level)

Upload flow:
Client: components.UploadImage posts file to /api/upload (app/api/upload/route.ts).
Server: route uploads file to Cloudinary using the v2 SDK and returns Cloudinary response (secure URL).
UI: after upload the page reloads and components.Main fetches images from /api/get-photos.

Display flow:
app/api/get-photos/route.ts calls Cloudinary API to list resources under uploads/.
components.RecentUploads renders the grid.

## Important files / symbols

- Cloudinary upload API: app.api.upload.POST
- Cloudinary list API: app.api.get-photos.GET
- Smooth scroll wrapper: components.LenisWrapper
- Upload UI: components.UploadImage
- Grid UI: components.RecentUploads
- Main composition: components.Main
- Modal/menu launcher: components.Model
- Page layout: app/layout
- Home page: app/page
(Open any of the linked files above for implementation details.)

## Development notes & tips
- Ensure env vars are set; otherwise Cloudinary calls will fail.
- The client upload uses FormData and the server route converts the incoming File to a Buffer for Cloudinary's upload_stream.
- The UI currently reloads after upload (window.location.reload()) — consider replacing this with state updates for a smoother UX.
- Tailwind is configured; styles live in app/globals.css.

# Scripts
Start dev server:
npm run dev

Build:
npm run build

Start production:
npm run start

Lint:
npm run lint

## Deployment
Deploy like a standard Next.js app (Vercel recommended). Make sure to set Cloudinary env vars in your deployment environment.