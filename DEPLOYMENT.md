# Deployment Guide for Render.com

This guide will help you deploy AgroCredit AI v2 to Render.com.

## Prerequisites

- GitHub repository with your code
- Render.com account (free tier available)

## Architecture

We'll deploy two services:
1. **Backend API** (FastAPI)
2. **Frontend** (Next.js)

---

## Step 1: Deploy Backend API

### 1.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Settings:**
- **Name**: `agrocredit-api` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Instance Type**: Free (or paid for better performance)

### 1.2 Environment Variables

Add these environment variables in Render dashboard:

```
PYTHON_VERSION=3.11
```

### 1.3 Deploy

Click **"Create Web Service"**. Render will:
- Clone your repository
- Install dependencies
- Start your API

**Note your API URL**: `https://agrocredit-api.onrender.com` (example)

---

## Step 2: Deploy Frontend

### 2.1 Update API URL

Before deploying frontend, update the API URL:

**File**: `frontend/lib/api.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agrocredit-api.onrender.com/api";
```

Commit and push this change to GitHub.

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

**Settings:**
- **Name**: `agrocredit-app`
- **Region**: Same as backend
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Free

### 2.3 Environment Variables

Add:

```
NEXT_PUBLIC_API_URL=https://agrocredit-api.onrender.com/api
NODE_VERSION=18
```

### 2.4 Deploy

Click **"Create Web Service"**

**Your app URL**: `https://agrocredit-app.onrender.com`

---

## Step 3: Database Persistence (Important!)

⚠️ **Free Render instances have ephemeral storage** - your SQLite database will reset on each deploy!

### Options:

#### Option A: Use Render Disk (Paid)
1. In backend service settings
2. Add a **Persistent Disk**
3. Mount path: `/opt/render/project/src/backend/data`

#### Option B: Use PostgreSQL (Recommended for Production)
1. Create a PostgreSQL database on Render (free 90 days)
2. Update backend to use PostgreSQL instead of SQLite
3. Add `DATABASE_URL` environment variable

#### Option C: External Database
- Use services like Supabase, PlanetScale, or Railway for database hosting

---

## Step 4: CORS Configuration

Ensure backend allows frontend origin:

**File**: `backend/app/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agrocredit-app.onrender.com",  # Production
        "http://localhost:3000"  # Development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Step 5: Testing

1. Visit your frontend URL
2. Test farmer and bank portals
3. Verify API calls work correctly
4. Check browser console for errors

---

## Troubleshooting

### Backend not starting
- Check Build Logs in Render dashboard
- Verify `requirements.txt` is correct
- Ensure Python version is specified

### Frontend build fails
- Check if `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check Node version compatibility

### API calls fail
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings
- Review backend logs

### Database resets
- Implement persistent storage (see Step 3)
- Consider migrating to PostgreSQL

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database persistence setup
- [ ] CORS properly configured
- [ ] SSL/HTTPS enabled (automatic on Render)
- [ ] Custom domain setup (optional)
- [ ] Error monitoring setup
- [ ] Backup strategy for database

---

## Free Tier Limitations

⚠️ Render free tier services:
- **Spin down after 15 minutes of inactivity**
- **Cold start takes 30-60 seconds**
- **Limited to 750 hours/month**

For production, consider upgrading to paid tier.

---

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)

---

## Next Steps

1. Set up custom domain
2. Configure monitoring and alerts
3. Set up CI/CD pipeline
4. Implement database backups
5. Add environment-specific configurations
