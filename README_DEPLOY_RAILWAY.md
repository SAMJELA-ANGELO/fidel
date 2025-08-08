## Railway Deployment Instructions

1. Push your code to GitHub.
2. Go to [Railway](https://railway.app/) and create a new project, linking your GitHub repo.
3. Set the following environment variables in Railway:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `MONGODB_URI`
   - `PORT` (Railway will set this automatically, but you can set to 5000 for local dev)
4. Railway will auto-detect the `start` script and deploy your app.
5. Use the generated Railway URL to access your API and `/api-docs`.

**Health check:** The root endpoint `/` returns `API is running` for Railway health checks.
