# Frontend deployment

Import this repository into Vercel as a Next.js project and keep the project
root at the repository root. The build command is `npm run build`.

Set `NEXT_PUBLIC_API_BASE_URL` in the Vercel project settings to the backend API
base URL, including `/api/v1` (for example,
`https://your-backend-domain/api/v1`). Add it for Production, Preview, and
Development as needed. This value is public and must not contain credentials.

Configure the backend's `FRONTEND_URL` to the deployed frontend origin and
allow the frontend origin in the backend CORS/auth settings.
