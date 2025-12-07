# AgroCredit AI v2

Smart Credit Solutions for Agriculture - Full-stack application with AI-powered scoring and recommendations.

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend
- FastAPI (Python)
- SQLite Database
- RESTful API

## Features

- **Farmer Portal**: Credit management, AI recommendations, farm monitoring
- **Bank Portal**: Application processing, farmer scoring, loan management
- **Real-time Updates**: Live data synchronization
- **Mobile-Responsive**: Optimized for all devices

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Render.com deployment instructions.

## License

MIT
