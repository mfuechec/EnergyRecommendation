# Quick Start Guide

**Get the app running in 60 seconds!**

---

## Step 1: Set Environment Variables

```bash
cp .env.example .env
```

Then edit `.env`:

### Option A: With OpenAI (Real AI)
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
DEMO_MODE=false
```

### Option B: Without OpenAI (Fallback Mode)
```
OPENAI_API_KEY=
DEMO_MODE=true
```

---

## Step 2: Start the Development Server

```bash
npm run dev
```

You should see:

```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.1s
```

---

## Step 3: Open in Browser

Go to [http://localhost:3000](http://localhost:3000)

---

## What You'll See

### Landing Page

- **Dropdown**: Select a customer (Sarah, Mike, David, Jessica, or Thompson Family)
- **Description**: Brief description of each customer's situation

### Customer Dashboard

After selecting a customer, you'll see:
- Current annual cost
- 12-month usage chart
- Current plan details
- AI-detected insights
- **"Get My Recommendations" button**

### Recommendations

Click the button to see:
- Top 3 personalized plan recommendations
- AI-generated explanations (real-time or fallback)
- Savings calculations
- Behavior optimization suggestions (for EV/pool owners)

---

## Expected Performance

✅ **Dashboard Load:** <1 second
✅ **Recommendations:** <3 seconds
✅ **AI Explanations:** Real-time (or instant fallback)

---

## Test All 5 Customers

1. **Sarah Mitchell** - Loyalty penalty (expect $427 savings)
2. **Mike Rodriguez** - Variable rate victim (expect $280 savings)
3. **David Park** - Solar owner (expect negative cost!)
4. **Jessica Chen** - EV owner (expect $365 savings + behavior tip)
5. **Thompson Family** - Pool owners (expect $407 savings + timer suggestion)

---

## Troubleshooting

### Port Already in Use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
# Or use a different port
npm run dev -- -p 3001
```

### OpenAI Errors?

Set `DEMO_MODE=true` in `.env` to use fallback explanations.

### Missing Data Files?

Check that these files exist in the `data/` directory:
- `raw_utility_data.json`
- `user_profiles.json`
- `system_analysis.json`
- `supplier_plans.json`
- `usage_assumptions.json`

### TypeScript Errors?

```bash
npm run build
```

If build succeeds, ignore IDE warnings.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Next Steps

1. **Test all 5 customers** - Verify calculations
2. **Record demo video** - Walk through each scenario
3. **Review architecture** - Check `docs/architecture.md`
4. **Test AI prompts** - Try different customers
5. **Prepare presentation** - Use talking points from README

---

**You're ready to demo! 🚀**
