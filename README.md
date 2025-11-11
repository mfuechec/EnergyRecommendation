# AI Energy Plan Recommendation Agent

**Demo Application Built by Winston | Gauntlet AI Bootcamp 2025**

An intelligent system that analyzes customer usage patterns and provides personalized energy plan recommendations using AI.

---

## Features

✅ **Three-Layer Data Architecture**
- Layer 1: Raw utility data (simulates API from Austin Energy)
- Layer 2: User profiles (from onboarding questionnaire)
- Layer 3: AI-generated insights (cached analysis)

✅ **Real-Time AI Recommendations**
- GPT-4 powered plan explanations
- Fallback to template-based explanations
- <3 second response time

✅ **Complete Cost Calculations**
- Fixed-rate plans
- Variable-rate plans
- Time-of-use plans
- Solar buyback plans

✅ **Behavior Optimization**
- EV charging optimization
- Pool equipment timing
- Automated savings calculations

✅ **5 Customer Scenarios**
- Sarah Mitchell - Loyalty penalty victim
- Mike Rodriguez - Variable rate victim
- David Park - Solar owner
- Jessica Chen - EV owner
- Thompson Family - Pool owners

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-proj-your-key-here
DEMO_MODE=false
```

**Note:** If you don't have an OpenAI key or want to use the demo with fallback explanations, set `DEMO_MODE=true`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── customers/          # Customer data API
│   │   └── recommendations/    # Recommendation generation
│   ├── layout.tsx              # App layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
│
├── components/
│   ├── dashboard/
│   │   ├── CustomerDashboard.tsx
│   │   └── UsageChart.tsx
│   └── recommendations/
│       ├── RecommendationsDisplay.tsx
│       ├── PlanCard.tsx
│       └── BehaviorCard.tsx
│
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── dataLoader.ts           # Load 3-layer data
│   ├── calculations.ts         # Cost calculation functions
│   ├── fitScore.ts             # Plan ranking algorithm
│   ├── openai.ts               # AI integration + fallback
│   ├── behaviorDetection.ts    # EV/pool optimization
│   └── recommendationEngine.ts # Main orchestrator
│
├── data/
│   ├── raw_utility_data.json   # Layer 1
│   ├── user_profiles.json      # Layer 2
│   ├── system_analysis.json    # Layer 3
│   ├── supplier_plans.json     # 20 Austin plans
│   └── usage_assumptions.json  # TOU calculations
│
└── docs/
    ├── architecture.md
    ├── onboarding-flow.md
    ├── ai-prompt-templates.md
    └── IMPLEMENTATION_GUIDE.md
```

---

## How It Works

### 1. Customer Selection

User selects one of 5 pre-loaded customer profiles from the dropdown.

### 2. Dashboard View

System loads all 3 data layers and displays:
- Current annual cost
- 12-month usage pattern
- Current plan details
- AI-detected risk factors and opportunities

### 3. Get Recommendations

Click "Get My Recommendations" button:
1. Load 20 supplier plans
2. Filter by user preferences
3. Calculate projected costs for each plan
4. Score and rank by fit algorithm
5. Generate AI explanations (GPT-4 or fallback)
6. Detect behavior optimization opportunities
7. Display results in <3 seconds

### 4. Review Results

- Top 3 plan recommendations with AI explanations
- Fit scores broken down by cost, renewable, flexibility, rating
- Behavior suggestions (if applicable)
- Current plan analysis

---

## Data Layer Architecture

### Layer 1: Raw Utility Data

Simulates what you'd receive from utility company APIs:

```json
{
  "customer_id": "CUST_001",
  "usage_history": [
    { "month": "2024-01", "kwh": 1050, "bill_amount": 142.70 }
  ],
  "current_plan": {
    "provider": "TXU Energy",
    "rate_per_kwh": 0.135
  }
}
```

**No insights, no interpretations - just raw facts.**

### Layer 2: User Profiles

Information collected during onboarding:

```json
{
  "customer_id": "CUST_001",
  "home_attributes": {
    "has_solar": false,
    "has_ev": false,
    "has_pool": false
  },
  "preferences": {
    "primary_concern": "cost_savings",
    "renewable_priority": "moderate"
  }
}
```

**The user tells you this during signup.**

### Layer 3: AI-Generated Insights

Analysis performed by GPT-4 and cached:

```json
{
  "customer_id": "CUST_001",
  "customer_segment": "loyalty_penalty_victim",
  "usage_analysis": {
    "pattern_type": "balanced_seasonal",
    "avg_monthly_kwh": 950
  },
  "financial_analysis": {
    "current_annual_cost": 1658.40,
    "rate_trend": {
      "total_increase_pct": 18.4
    }
  }
}
```

**AI derives this from Layers 1 + 2.**

---

## AI Integration

### OpenAI Mode (Real AI)

Set `DEMO_MODE=false` and provide your OpenAI API key.

- Plan explanations generated in real-time by GPT-4
- ~$0.01 per explanation
- ~$0.03 per recommendation request (3 explanations)

### Demo Mode (Fallback)

Set `DEMO_MODE=true` for template-based explanations.

- No API key needed
- Fast, deterministic responses
- Still produces quality explanations

---

## Customer Scenarios

### CUST_001: Sarah Mitchell

- **Segment:** Loyalty penalty victim
- **Issue:** 4 years on same plan, 18% rate increase
- **Expected Savings:** $427/year
- **Best Plan:** Chariot Solar 100

### CUST_002: Mike Rodriguez

- **Segment:** Variable rate victim
- **Issue:** Variable rates spike during summer
- **Expected Savings:** $280/year
- **Best Plan:** Fixed-rate protection

### CUST_003: David Park

- **Segment:** Solar buyback victim
- **Issue:** Poor buyback rate ($0.065/kWh)
- **Expected Savings:** $287/year (negative cost possible)
- **Best Plan:** Better solar buyback

### CUST_004: Jessica Chen

- **Segment:** EV owner on flat rate
- **Issue:** Not benefiting from overnight charging
- **Expected Savings:** $365/year
- **Best Plan:** Time-of-use with super off-peak rates
- **Behavior:** Keep charging overnight (no change needed)

### CUST_005: Thompson Family

- **Segment:** Pool owner, peak usage
- **Issue:** Pool running during peak hours
- **Expected Savings:** $407/year
- **Best Plan:** Time-of-use plan
- **Behavior:** Install $75 timer, run overnight

---

## API Endpoints

### GET /api/customers

Returns list of available customer profiles.

### GET /api/customers/:id

Returns complete customer data (all 3 layers).

### POST /api/recommendations

Generate recommendations for a customer.

**Request:**
```json
{
  "customer_id": "CUST_001",
  "preferences": {
    "priority": "cost_savings",
    "renewable_preference": "moderate",
    "max_contract_months": 12
  }
}
```

**Response:** See `RecommendationResponse` type in `lib/types.ts`

---

## Testing

### Test All Customers

1. Select each customer from dropdown
2. Review dashboard data
3. Click "Get Recommendations"
4. Verify AI explanations are relevant
5. Check savings calculations

### Expected Results

| Customer | Segment | Top Plan | Savings |
|----------|---------|----------|---------|
| Sarah | Loyalty penalty | Chariot Solar 100 | $427 |
| Mike | Variable rate | Fixed-rate plan | $280 |
| David | Solar victim | Better buyback | $287 |
| Jessica | EV flat rate | TOU plan | $365 |
| Thompson | Pool peak | TOU + timer | $407 |

---

## Architecture Highlights

### Realistic Data Separation

✅ Utility API → Raw kWh and billing
✅ User input → Home attributes and preferences
✅ AI analysis → Insights derived from data

### Production-Ready Calculations

✅ Fixed, variable, TOU, and solar plans
✅ Seasonal variance detection
✅ Behavior optimization logic
✅ Fit score algorithm with penalties/bonuses

### AI with Fallback

✅ Real-time GPT-4 explanations
✅ Template-based fallback (no API failures)
✅ <3 second response time

---

## Demo Script

### Act 1: The Problem (45 sec)

> "In deregulated energy markets, customers face decision paralysis. 50+ plans, complex rate structures, hidden fees..."

### Act 2: The Solution (30 sec)

> "The AI Energy Plan Recommendation Agent analyzes your usage and finds the best plan for you..."

### Act 3-7: Customer Scenarios (90 sec each)

Walk through each customer:
1. Show dashboard
2. Explain current situation
3. Generate recommendations
4. Highlight AI explanation
5. Show savings

### Act 8: Business Model (30 sec)

> "Supplier switches generate revenue. Behavior features drive engagement. It's a powerful flywheel..."

---

## What's Next

### For Production

- Real OAuth with utility APIs
- Hourly smart meter data
- PostgreSQL + Redis
- Email notifications
- Mobile app

### For Demo

✅ Everything is ready!
1. Install dependencies
2. Add OpenAI key (or use DEMO_MODE)
3. Run `npm run dev`
4. Record video walkthrough

---

## Credits

**Architecture:** Winston (System Architect)
**Data Model:** Three-layer separation (utility/user/AI)
**AI Prompts:** GPT-4 with fallback strategy
**Bootcamp:** Gauntlet AI 2025

---

## License

MIT - Demo Project for Educational Purposes

---

**Questions?** Check `docs/IMPLEMENTATION_GUIDE.md` for complete details.
