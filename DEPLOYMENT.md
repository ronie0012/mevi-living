# CI/CD Deployment Setup

This guide covers setting up CI/CD deployment with GitHub Actions for both Vercel and Render platforms.

## Overview

Your project is configured with:
- **GitHub Actions** workflows for automated testing and deployment
- **Vercel** deployment configuration with preview and production environments  
- **Render** deployment configuration with Docker support
- Environment variable management for secure deployments

## Quick Start

1. **Choose your deployment platform**: Vercel or Render
2. **Set up GitHub repository secrets** (see below)
3. **Push to main/master branch** to trigger deployment

## Vercel Deployment

### Prerequisites
1. Create a Vercel account and project
2. Install Vercel CLI locally: `npm i -g vercel`
3. Run `vercel` in your project directory to link it

### Required GitHub Secrets

Add these secrets in your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

```
VERCEL_TOKEN          # Get from Vercel dashboard → Settings → Tokens
VERCEL_ORG_ID         # Get from vercel --org command or dashboard
VERCEL_PROJECT_ID     # Get from vercel command or dashboard  
DATABASE_URL          # Your production database URL
BETTER_AUTH_SECRET    # Generate 64-character random string
JWT_SECRET           # Generate 64-character random string
OPENAI_API_KEY       # Your OpenAI API key
```

### Workflow Features
- **Pull Request Previews**: Automatic preview deployments on PRs
- **Production Deployment**: Automatic deployment on main/master branch pushes
- **Testing**: Runs linting and build tests before deployment
- **Environment Variables**: Secure handling of secrets

### Manual Setup Commands
```bash
# Link project to Vercel
vercel --yes

# Set environment variables (optional, can be done via dashboard)
vercel env add BETTER_AUTH_SECRET production
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production
```

## Render Deployment

### Prerequisites
1. Create a Render account
2. Create a new Web Service from your GitHub repository

### Required GitHub Secrets

```
RENDER_API_KEY           # Get from Render dashboard → Account Settings → API Keys
RENDER_SERVICE_ID        # Get from your service dashboard URL
RENDER_DEPLOY_HOOK_URL   # Optional: Get from service settings → Deploy Hook
```

### Render Service Configuration

When creating your Render service, use these settings:
- **Runtime**: Docker
- **Build Command**: `docker build -t app .`
- **Start Command**: `docker run -p 3000:3000 app`
- **Environment Variables**: Copy from `.env.production.example`

### Docker Configuration

The included `Dockerfile` is optimized for Next.js production deployment with:
- Multi-stage builds for smaller image size
- Security best practices (non-root user)
- Standalone output for better performance

## Environment Variables

### Development
Copy `.env.example` to `.env.local` and fill in your values.

### Production
Use `.env.production.example` as a template for your production environment variables.

**Critical Variables to Set:**
- `DATABASE_URL`: Your production database connection
- `BETTER_AUTH_SECRET`: 64-character random string for auth security
- `JWT_SECRET`: 64-character random string for JWT signing
- `NEXT_PUBLIC_APP_URL`: Your production domain URL
- `OPENAI_API_KEY`: Required for AI features

### Generating Secure Secrets
```bash
# Generate secure random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## GitHub Actions Workflows

### Vercel Workflow (`.github/workflows/vercel-deploy.yml`)
- Triggers on push to main/master and pull requests
- Runs tests (linting, build)
- Deploys previews for PRs
- Deploys to production for main branch

### Render Workflow (`.github/workflows/render-deploy.yml`)
- Triggers on push to main/master
- Runs tests before deployment
- Uses Render API or deploy hooks for deployment

## Database Migrations

For production deployments with database changes:

### Vercel
Add build command in `package.json` or use Vercel build settings:
```json
{
  "scripts": {
    "build": "npm run db:migrate && next build"
  }
}
```

### Render  
Add to Dockerfile before the build step:
```dockerfile
RUN npm run db:migrate
```

## Monitoring and Debugging

### Vercel
- View deployment logs in Vercel dashboard
- Use `vercel logs` CLI command for real-time logs
- Function logs available in dashboard

### Render
- View service logs in Render dashboard
- Use log streaming for real-time debugging
- Monitor resource usage in dashboard

## Troubleshooting

### Common Issues

**Build Failures:**
- Check environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Verify database migrations run successfully

**Deployment Timeouts:**
- Optimize build process
- Check for large dependencies
- Review function execution times

**Environment Variable Issues:**
- Verify secret names match exactly in workflows
- Check variable availability in deployment platform
- Ensure sensitive data is in secrets, not committed code

### Debug Commands
```bash
# Test build locally
npm run build

# Lint check
npm run lint

# Verify environment variables
vercel env ls  # For Vercel
```

## Security Best Practices

1. **Never commit secrets** to your repository
2. **Use strong random strings** for auth secrets (64+ characters)
3. **Set up proper CORS** for your API endpoints
4. **Enable environment variable encryption** in your deployment platform
5. **Rotate secrets regularly** in production

## Next Steps

1. Set up monitoring and alerting for your deployments
2. Configure custom domains in your deployment platform
3. Set up database backups for production
4. Consider setting up staging environments
5. Implement proper logging and error tracking

## Support

- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Render**: [Render Documentation](https://render.com/docs)
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/en/actions)