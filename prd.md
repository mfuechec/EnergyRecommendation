# AI Energy Plan Recommendation Agent
**Organization:** Arbor  
**Project ID:** 85twgWvlJ3Z1g6dpiGy5_1762214728178

## Product Requirements Document (PRD) - Video Demo Version

---

## 1. Executive Summary

The AI Energy Plan Recommendation Agent is an intelligent solution developed by Arbor to assist customers in deregulated energy markets. This agent analyzes individual customer usage patterns and preferences to provide:

1. **Supplier Switch Recommendations** - Top 3 optimal energy plans with projected savings
2. **Behavior Change Suggestions** - Usage optimization strategies to reduce costs

The dual approach creates a powerful engagement flywheel: behavior insights drive daily app usage and retention, while supplier switches generate direct revenue for Arbor.

### Development Strategy: Video Demo First

This project follows a **demo-first methodology** with a 5-10 minute pre-recorded video presentation. The demo showcases real AI-powered recommendations using OpenAI API, demonstrating both technical capability and product-market fit to a tech/product audience.

**Demo Deliverable:** Pre-recorded video walkthrough showing 3-5 customer scenarios  
**Technical Goal:** Prove AI recommendation engine works with real-time API calls  
**Business Goal:** Demonstrate dual value proposition (revenue + engagement)  
**Timeline:** 10-14 days to functional demo

---

## 2. Problem Statement

Customers in deregulated energy markets face two compounding problems:

1. **Plan Selection Paralysis:** 50-100+ supplier options with complex rate structures, making it difficult to identify cost-effective plans
2. **Hidden Usage Costs:** Customers don't understand how their behavior (EV charging times, pool schedules, etc.) impacts their bills

The AI Energy Plan Recommendation Agent solves both problems:
- **Immediate value:** Supplier switch recommendations with clear savings projections
- **Ongoing value:** Behavior optimization insights that drive daily engagement

---

## 3. Goals & Success Metrics

### Business Model
- **Primary Revenue:** Commission from supplier switches ($75-150 per switch)
- **Retention Driver:** Behavior optimization features increase app engagement and customer lifetime value
- **Conversion Funnel:** Free behavior insights → Build trust → Drive supplier switches

### Demo Success Metrics
- ✅ **Technical Validation:** AI generates accurate recommendations in <3 seconds
- ✅ **Stakeholder Understanding:** Audience can explain dual value prop after demo
- ✅ **Confidence Building:** Demonstration of real-time AI integration proves technical capability
- ✅ **Go/No-Go Decision:** Secure approval for production development phase

### Production Success Metrics (Future)
- 20%+ conversion rate on supplier switch recommendations
- 10 point NPS increase from personalized recommendations
- 3x increase in daily active users from behavior optimization features
- 30% reduction in customer support inquiries

---

## 4. Target Users & Value Propositions

### User Segment 1: Supplier Switch Candidates (Direct Revenue)
**Profile:** Customers overpaying on current plans who can save by switching

**Personas:**
- **The Loyalty Penalty Victim** - Long-term customer, rates have increased over time
- **The Variable Rate Disaster** - Getting destroyed by seasonal rate spikes
- **The Solar Owner** - Poor net metering/buyback rates on current plan

**Value Prop:** "Switch to this plan and save $300-500/year doing nothing different"

### User Segment 2: Behavior Optimizers (Engagement + Future Switches)
**Profile:** Customers who can reduce costs through usage pattern changes

**Personas:**
- **The EV Owner** - Already charging overnight, just needs time-of-use plan
- **The Pool Owner** - Simple timer installation + rate change saves $380/year

**Value Prop:** "Small change = big savings. We'll guide you through it and track your progress"

---

## 5. User Stories (Demo Scenarios)

### Scenario 1: Sarah Mitchell - The Loyalty Penalty
**Type:** Supplier Switch  
**User Story:** As a loyal customer who hasn't shopped around in years, I want to discover if I'm overpaying so I can switch to a better plan without changing my usage.

**Demo Flow:**
- Login as Sarah
- Show dashboard: 4 years on same plan, rate increased 18% to $0.135/kWh
- Display current annual cost: $1,658
- Run AI recommendations
- Show top 3 plans with savings ($300-400/year)
- Highlight: 100% renewable plan saves most money
- **Outcome:** Simple supplier switch, no behavior change needed

### Scenario 2: Mike Rodriguez - The Variable Rate Victim
**Type:** Supplier Switch  
**User Story:** As a work-from-home professional with high summer AC usage, I want protection from variable rate spikes so I can budget my energy costs predictably.

**Demo Flow:**
- Login as Mike
- Show dashboard: Summer bills hitting $225-260/month
- Show usage pattern: Low winter (650 kWh) → High summer (1,750 kWh)
- Current plan: Variable rates spike to $0.145 in summer
- Run AI recommendations
- Show fixed-rate plans that eliminate spikes
- **Outcome:** $200-300/year savings + budget predictability

### Scenario 3: David Park - The Solar Owner
**Type:** Supplier Switch  
**User Story:** As a solar panel owner, I want to maximize the value of my excess generation so my $18k investment actually pays off.

**Demo Flow:**
- Login as David
- Show dashboard: 8.5kW system, generating 590 kWh excess annually
- Current buyback rate: $0.065/kWh (wholesale)
- Current annual cost: $220
- Run AI recommendations
- Show plan with $0.110/kWh buyback (near-retail)
- **Outcome:** Annual cost goes NEGATIVE (-$67), saves $287/year

### Scenario 4: Jessica Chen - The EV Owner
**Type:** Supplier Switch + Behavior Optimization  
**User Story:** As an EV owner who already charges overnight, I want a plan that rewards my good habits so I can reduce my charging costs.

**Demo Flow:**
- Login as Jessica
- Show dashboard: Tesla Model 3, 400 kWh/month EV charging
- Current behavior: Already charging 11pm-7am (optimal!)
- Current plan: Flat rate $0.118/kWh
- Run AI recommendations
- **Supplier recommendation:** Time-of-use plan with $0.045/kWh super off-peak
- **Behavior suggestion:** "Keep doing what you're doing! Your charging habits are perfect."
- Show EV cost tracker feature
- **Outcome:** $350/year savings, zero behavior change required

### Scenario 5: Thompson Family - The Pool Owners
**Type:** Behavior Optimization + Supplier Switch  
**User Story:** As pool owners, I want to know if running my equipment at different times would save money and how much.

**Demo Flow:**
- Login as Thompson family
- Show dashboard: Pool equipment runs 2pm-10pm (peak hours)
- Pool portion of bill: $423/year
- Run AI recommendations
- **Supplier recommendation:** Time-of-use plan
- **Behavior suggestion:** "Install $75 timer, run pool 10pm-6am"
- Show savings calculation: $380/year after timer cost
- Show "Pool Optimizer" feature in app
- **Outcome:** One-time $75 investment, ongoing savings, increased engagement

### Scenario 6 (Optional): Preference Changes
**Type:** Show AI Adaptability  
**Demo Flow:**
- Return to Sarah's profile
- Toggle preferences: Change from "cost priority" to "100% renewable priority"
- Re-run AI recommendations
- Show how top 3 plans change based on new priorities
- **Outcome:** Proves AI considers user preferences, not just one-size-fits-all

---

## 6. Functional Requirements

### P0: Must-Have (Demo Scope)

#### Customer Login System
- Login dropdown with 5 customer profiles pre-loaded
- Each customer has:
  - Name, location, customer type
  - 12 months usage history
  - Current plan details
  - Current annual cost calculated

#### Dashboard View
- Display customer profile summary
- Usage visualization (12-month chart)
- Current plan details card
- Current annual cost prominently displayed
- "Get Recommendations" CTA button

#### Preference Inputs
- Priority selector: Cost Savings / Renewable Energy / Flexibility
- Renewable preference: Low / Moderate / High / 100% Required
- Max contract length: 0, 6, 12, 24 months
- Preferences remembered per customer session

#### AI Recommendation Engine
- **Real-time OpenAI API integration**
- Input: Customer usage data + current plan + preferences + supplier catalog
- Processing: Calculate costs for all plans, rank by fit score, generate explanations
- Output: Top 3 supplier recommendations + behavior suggestions (if applicable)

#### Supplier Recommendations Display
Each of top 3 plans shows:
- Plan name and provider
- Rate structure and key terms
- Projected annual cost
- Annual savings vs current plan
- AI-generated plain-language explanation (2-3 sentences)
- Key benefits (bullet points)
- Warnings/considerations (if applicable)
- "View Details" expandable section

#### Behavior Change Suggestions (Conditional)
For EV owners and pool owners, display:
- Specific behavior optimization recommendation
- Required changes (if any)
- Cost of implementation (e.g., $75 timer)
- Projected annual savings
- Payback period
- Link to feature: "Track Your Savings" or "Setup Your Schedule"

#### Calculations & Logic
- Annual cost formula: `Σ(monthly_kwh × rate) + (12 × monthly_fee)`
- Variable rate handling: Apply peak rates to specified months
- Solar buyback calculations: Credit excess generation, charge net purchases
- Time-of-use calculations: Apply rate tiers based on usage assumptions
- Switching cost considerations: Early termination fees, signup bonuses
- Fit score algorithm: Weight cost, renewable %, contract flexibility based on preferences

#### AI Explanation Generation
**OpenAI API Prompt Structure:**
```
You are an energy plan recommendation expert. Generate a 2-3 sentence 
explanation for why this plan is recommended for this customer.

Customer Context:
- Usage pattern: [description]
- Current plan: [details]
- Current cost: [amount]
- Preferences: [priorities]

Recommended Plan:
- Name: [plan name]
- Rate: [rate details]
- Savings: [amount]
- Key features: [list]

Generate a clear, friendly explanation that:
1. References the customer's specific situation
2. Explains why this plan is a good fit
3. Highlights the most compelling benefit
4. Uses plain language (avoid jargon)
```

### P1: Should-Have (Post-Demo)
- User account creation and authentication
- Save recommendation history
- Email/SMS notifications when better plans become available
- Share recommendations with family members
- Integration with utility APIs for automated usage data import

### P2: Nice-to-Have (Future)
- Mobile app (iOS/Android)
- Smart home device integrations
- Usage forecasting based on weather
- Gamification of energy savings
- Social features (compare savings with friends)
- Referral program

---

## 7. Non-Functional Requirements

### Performance
- **Demo Critical:** AI recommendations generated in <3 seconds (must feel instant)
- Dashboard loads in <1 second
- Usage charts render smoothly (no lag)

### Reliability
- OpenAI API error handling (fallback to cached recommendations if API fails)
- Graceful degradation if supplier data is stale

### Security
- Mock authentication for demo (no real passwords)
- Production: OAuth 2.0, encrypted data at rest
- PII handling: Anonymize customer data in logs

### Scalability (Production)
- Cloud infrastructure (Vercel/AWS)
- Handle 10,000+ concurrent users
- Daily supplier plan catalog updates

### User Experience
- Clean, modern interface (similar to fintech apps)
- Mobile-responsive design
- Accessibility: WCAG 2.1 AA compliance
- Load states and progress indicators
- Error messages in plain language

---

## 8. Technical Architecture

### Technology Stack

**Frontend:**
- React.js with TypeScript
- Tailwind CSS for styling
- Recharts for usage visualizations
- React Query for API state management

**Backend:**
- Node.js with Express (or Next.js API routes)
- RESTful API architecture

**AI/LLM:**
- OpenAI API (GPT-4) for generating explanations
- Real-time API calls during demo

**Data Storage:**
- Demo: JSON files (customer profiles, supplier plans)
- Production: PostgreSQL + Redis cache

**Hosting:**
- Vercel (frontend + API routes)
- Fast global CDN for video demo

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Login      │  │  Dashboard   │  │  Results  │ │
│  │   Dropdown   │  │  + Prefs     │  │  Display  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              API Layer (Node/Express)                │
│  ┌──────────────────────────────────────────────┐  │
│  │     Recommendation Engine Core               │  │
│  │  • Load customer data                        │  │
│  │  • Load supplier catalog                     │  │
│  │  • Calculate costs for all plans             │  │
│  │  • Rank by fit score                         │  │
│  │  • Call OpenAI for explanations              │  │
│  │  • Return top 3 + behavior suggestions       │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌──────────────────┐          ┌──────────────────────┐
│   OpenAI API     │          │   Data Layer         │
│   (GPT-4)        │          │  • customers.json    │
│                  │          │  • plans.json        │
│  Generate        │          │  • market_data.json  │
│  explanations    │          │                      │
└──────────────────┘          └──────────────────────┘
```

### API Endpoints

**GET /api/customers**
- Returns list of available customer profiles
- Used to populate login dropdown

**GET /api/customers/:id**
- Returns full customer profile including usage history
- Used to load dashboard

**GET /api/plans**
- Returns supplier plan catalog for Austin
- Optional filters: renewable_min, rate_max, time_of_use

**POST /api/recommendations**
```json
Request:
{
  "customer_id": "CUST_001",
  "preferences": {
    "priority": "cost_savings",
    "renewable_preference": "moderate",
    "max_contract_months": 12
  }
}

Response:
{
  "top_recommendations": [
    {
      "rank": 1,
      "plan_id": "PLAN_004",
      "plan_name": "Chariot Energy - Solar 100",
      "provider": "Chariot Energy",
      "rate_per_kwh": 0.108,
      "monthly_fee": 0,
      "projected_annual_cost": 1289.20,
      "annual_savings": 369.20,
      "explanation": "Your balanced usage pattern with winter and summer peaks benefits from rate stability at $0.108/kWh. This 100% solar plan eliminates your monthly fee entirely, which adds up to $120 extra savings per year.",
      "key_benefits": [
        "Save $369 annually",
        "100% Texas solar energy",
        "No monthly fee",
        "Excellent buyback rates if you add solar later"
      ],
      "considerations": [
        "$150 early termination fee (but you're month-to-month now)"
      ]
    },
    // ... plans 2 and 3
  ],
  "behavior_suggestions": null, // or array if applicable
  "current_plan_analysis": {
    "current_annual_cost": 1658.40,
    "rate_history": [...],
    "comparison_to_market": "Paying 14% above market average"
  }
}
```

### Core Calculation Logic

**Annual Cost Calculator:**
```javascript
function calculateAnnualCost(usageHistory, plan) {
  let totalCost = 0;
  
  usageHistory.forEach(month => {
    let rate = plan.rate_per_kwh;
    
    // Handle variable rates
    if (plan.rate_structure === 'variable') {
      const monthNum = new Date(month.month).getMonth() + 1;
      if (plan.peak_months.includes(monthNum)) {
        rate = plan.rate_per_kwh_peak;
      } else {
        rate = plan.rate_per_kwh_base;
      }
    }
    
    // Handle time-of-use (requires usage breakdown assumptions)
    if (plan.rate_structure === 'time_of_use') {
      rate = calculateWeightedTimeOfUseRate(month.kwh, plan);
    }
    
    totalCost += (month.kwh * rate);
  });
  
  // Add annual fixed costs
  totalCost += (plan.monthly_fee * 12);
  
  return totalCost;
}
```

**Fit Score Algorithm:**
```javascript
function calculateFitScore(customer, plan, preferences) {
  let score = 0;
  
  // Cost component (40-70% weight depending on priority)
  const costWeight = preferences.priority === 'cost_savings' ? 0.7 : 0.4;
  const projectedCost = calculateAnnualCost(customer.usage_history, plan);
  const currentCost = customer.current_annual_cost;
  const savingsRatio = (currentCost - projectedCost) / currentCost;
  score += savingsRatio * costWeight * 100;
  
  // Renewable component (10-50% weight)
  const renewableWeight = preferences.renewable_preference === 'high' ? 0.5 : 0.1;
  score += (plan.renewable_percentage / 100) * renewableWeight * 100;
  
  // Contract flexibility component (10-30% weight)
  const flexWeight = preferences.priority === 'flexibility' ? 0.3 : 0.1;
  const flexScore = plan.contract_length_months === 0 ? 1.0 :
                   plan.contract_length_months <= 6 ? 0.8 :
                   plan.contract_length_months <= 12 ? 0.6 : 0.4;
  score += flexScore * flexWeight * 100;
  
  // Supplier rating component (10% weight)
  score += (plan.supplier_rating / 5) * 0.1 * 100;
  
  // Penalties
  if (plan.early_termination_fee > 200) score -= 5;
  if (plan.rate_structure === 'variable' && customer.high_seasonal_variance) score -= 10;
  
  return score;
}
```

**OpenAI Integration:**
```javascript
async function generateExplanation(customer, plan, savings) {
  const prompt = `You are an energy plan recommendation expert. Generate a 2-3 sentence explanation for why this plan is recommended.

Customer: ${customer.name}
Usage Pattern: ${customer.usage_stats.usage_pattern}
Current Rate: $${customer.current_plan.rate_per_kwh}/kWh
Current Annual Cost: $${customer.current_annual_cost}

Recommended Plan: ${plan.plan_name} by ${plan.provider}
New Rate: $${plan.rate_per_kwh}/kWh
Projected Cost: $${plan.projected_annual_cost}
Annual Savings: $${savings}
Key Feature: ${plan.renewable_percentage}% renewable

Generate a clear, friendly explanation that:
1. References the customer's specific situation
2. Explains why this rate/plan structure is a good fit
3. Highlights the most compelling benefit
4. Uses plain language (no jargon)`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 150
  });
  
  return response.choices[0].message.content;
}
```

---

## 9. Demo Video Structure

### Video Flow (5-10 minutes)

**Act 1: The Problem (45 seconds)**
- Screen: Energy market comparison sites showing 50+ confusing plans
- Voiceover: "In deregulated energy markets, customers face decision paralysis. 50+ plans, complex rate structures, hidden fees. Most people just stick with what they have and overpay for years."
- Screen: Show typical customer struggle - spreadsheets, confusion
- Transition: "What if AI could solve this?"

**Act 2: The Solution Overview (30 seconds)**
- Screen: Clean app landing page
- Voiceover: "Meet the AI Energy Plan Recommendation Agent. It analyzes your usage pattern and finds the best plan for you. But it goes further - it also suggests simple changes that save you money."
- Screen: Show dual value prop visual
- Transition: "Let me show you how it works."

**Act 3: Scenario 1 - Sarah (Supplier Switch) (90 seconds)**
- Login as Sarah
- Show dashboard with 4-year rate increase timeline
- Click "Get Recommendations"
- Show AI loading (2 seconds)
- Display top 3 plans
- Focus on #1: Chariot Solar 100
- Read AI explanation
- Highlight: "$369/year savings, zero behavior change"
- Show comparison table
- Voiceover: "Sarah's been loyal for 4 years. Her provider 'rewarded' her with 3 rate increases. One click, she discovers she's been overpaying $369 every year. The AI found her a 100% renewable plan that's actually cheaper."

**Act 4: Scenario 2 - Mike (Variable Rate Protection) (90 seconds)**
- Login as Mike
- Show summer bill shock ($225-260/month)
- Show usage chart: winter vs summer spike
- Click "Get Recommendations"
- Display results focusing on fixed-rate protection
- Highlight: Summer bills go from $250 → $145
- Voiceover: "Mike works from home. His summer bills are insane. He thinks he's using too much energy. He's wrong. The AI shows him his usage is normal - his plan is predatory. Variable rates spike to $0.145 in summer. Switching to fixed-rate saves him $200/year and eliminates bill shock."

**Act 5: Scenario 3 - David (Solar Owner) (90 seconds)**
- Login as David
- Show solar dashboard: 8.5kW system, excess generation
- Show current buyback rate: $0.065 (wholesale)
- Click "Get Recommendations"
- Display plan with $0.110 buyback
- Highlight: Annual cost goes NEGATIVE
- Show ROI calculation: 82 years → 36 years
- Voiceover: "David invested $18,000 in solar panels. At his current buyback rate, it'll take 82 years to pay off. The AI found him a plan that credits excess generation at near-retail rates. Now his annual electricity cost is negative $67. The grid pays him. His solar investment pays off in 36 years, not 82."

**Act 6: Scenario 4 - Jessica (EV + Behavior) (75 seconds)**
- Login as Jessica
- Show EV usage breakdown
- Note: Already charging overnight (good behavior)
- Click "Get Recommendations"
- Show time-of-use plan with super off-peak rates
- Display behavior suggestion: "Keep charging overnight!"
- Show EV cost calculator: $47/month → $18/month
- Voiceover: "Jessica drives a Tesla. She already charges overnight - perfect behavior. But she's on a flat-rate plan. The AI recommends a time-of-use plan that rewards her good habits. Her EV charging cost drops from $47 to $18 per month. $350/year savings, zero behavior change required. And she gets an EV cost tracker to monitor her savings."

**Act 7: Scenario 5 - Thompson Family (Pool + Behavior) (75 seconds)**
- Login as Thompson family
- Show pool equipment schedule: 2pm-10pm
- Show pool portion of bill: $423/year
- Click "Get Recommendations"
- Display time-of-use plan + timer recommendation
- Show calculation: $75 timer → $380/year savings
- Show "Pool Optimizer" app feature
- Voiceover: "The Thompson family has a pool. Their equipment runs during peak hours. The AI spots this and makes a suggestion: Install a $75 timer, run the pool overnight, switch to a time-of-use plan. Result: $380 per year in savings. The app even has a pool optimizer feature to help them set it up and track the savings. One small change, ongoing value."

**Act 8: Show Adaptability (Optional - 45 seconds)**
- Return to Sarah's profile
- Change preference from "cost priority" to "100% renewable priority"
- Re-run recommendations
- Show how results change
- Voiceover: "The AI doesn't just optimize for cost. Watch what happens when Sarah says renewable energy is her priority. The recommendations adapt. Same usage pattern, different values, different results. Every customer is unique."

**Act 9: The Business Model (30 seconds)**
- Screen: Visual of dual value prop
- Voiceover: "This creates a powerful flywheel for Arbor. Supplier switches generate direct revenue through commissions. But behavior optimization features drive daily engagement. Users open the app to track their EV charging costs, monitor their pool savings, see real-time pricing. Higher engagement means better retention. Better retention means more future switches. It's not just a marketplace - it's a platform."

**Act 10: Wrap Up (30 seconds)**
- Screen: Summary stats from demo
  - 5 customers
  - Average savings: $320/year per customer
  - Zero customers needed to change their lifestyle
  - 2 customers got behavior optimization features
- Voiceover: "The AI Energy Plan Recommendation Agent solves decision paralysis and empowers customers to save money. It's built on real AI - every recommendation you saw was generated in real-time by GPT-4. The technology works. The value proposition is clear. Now it's time to scale it."
- Screen: "Demo by [Your Name] - Gauntlet AI Bootcamp"

---

## 10. Development Timeline

### Week 1: Core Infrastructure (Days 1-7)
- [ ] Set up React app with TypeScript
- [ ] Design dashboard UI/UX (Figma mockups)
- [ ] Build customer login dropdown
- [ ] Create dashboard view with usage chart
- [ ] Implement preference selectors
- [ ] Set up API structure
- [ ] Load customer and plan JSON data

### Week 2: AI & Calculations (Days 8-14)
- [ ] Implement annual cost calculator
- [ ] Build fit score algorithm
- [ ] Integrate OpenAI API for explanations
- [ ] Create recommendation ranking logic
- [ ] Build behavior change suggestion system
- [ ] Implement results display UI
- [ ] Handle loading states and errors

### Week 3: Polish & Recording (Days 15-21)
- [ ] Refine UI/UX based on testing
- [ ] Add animations and transitions
- [ ] Optimize API call speed (<3 seconds)
- [ ] Test all 5 customer scenarios
- [ ] Write and rehearse video script
- [ ] Record demo video
- [ ] Edit and add voiceover/captions
- [ ] Final QA and deploy

---

## 11. Risk Analysis & Mitigation

### Technical Risks

**Risk: OpenAI API latency or failure during demo**
- Mitigation: Pre-generate backup recommendations as fallback
- Test API thoroughly before recording
- Have cached responses ready if live demo is required

**Risk: Calculation errors in cost projections**
- Mitigation: Manual verification of all scenarios
- Unit tests for calculation functions
- Cross-reference with real energy bills

**Risk: UI performance issues**
- Mitigation: Optimize React rendering
- Lazy load components
- Test on various screen sizes

### Business Risks

**Risk: Stakeholders don't understand dual value prop**
- Mitigation: Clear visual separation of supplier vs behavior recommendations
- Explicit articulation in video voiceover
- Include slide showing business model

**Risk: Demo doesn't showcase AI capability**
- Mitigation: Show real-time API calls (subtle loading indicator)
- Include "reasoning" in explanations that references specific customer data
- Mention AI/LLM usage explicitly in voiceover

---

## 12. Success Criteria

### Demo Must Demonstrate:
1. ✅ **Technical Competence:** Real-time AI integration that works reliably
2. ✅ **Product Vision:** Clear dual value proposition (revenue + engagement)
3. ✅ **Business Model:** How Arbor makes money and retains users
4. ✅ **User Value:** Tangible savings ($300-400/year) and actionable insights
5. ✅ **Scalability:** System can handle diverse customer scenarios

### Stakeholder Takeaways:
- "This actually works - the AI generates real recommendations"
- "I understand why both supplier switching AND behavior insights matter"
- "The developer can clearly execute on this vision"
- "This is worth building to production"

---

## 13. Post-Demo: Production Roadmap

### Phase 1: MVP Launch (Months 1-2)
- Real authentication system
- Utility API integrations for auto-importing usage data
- Expanded supplier catalog (beyond Austin)
- User accounts and recommendation history
- Email notifications for new opportunities

### Phase 2: Behavior Features (Months 3-4)
- EV charging optimizer with real-time pricing
- Pool equipment scheduler
- Smart thermostat integration (Nest, Ecobee)
- Usage forecasting based on weather
- Gamification and savings streaks

### Phase 3: Scale & Monetization (Months 5-6)
- Mobile app (iOS/Android)
- Premium subscription tier ($5/month for advanced features)
- Referral program (earn $25 per friend who switches)
- White-label partnerships with utilities
- B2B offering for solar installers and EV dealers

---

## 14. Appendix

### A. Technology Decisions

**Why React?**
- Fast development with component reusability
- Strong ecosystem for data visualization (Recharts)
- Easy to make responsive and accessible

**Why OpenAI over Claude API?**
- You mentioned having OpenAI API key already
- GPT-4 generates excellent natural language explanations
- Proven reliability at scale

**Why Vercel?**
- Zero-config deployment for Next.js
- Global CDN for fast video delivery
- API routes eliminate need for separate backend

### B. Data Sources

**Customer Profiles:** `customer_profiles_austin.json`
- 5 diverse scenarios covering key use cases
- Real usage patterns based on Austin climate
- Accurate current plan data from actual providers

**Supplier Plans:** `austin_supplier_plans.json`
- 20 real plans from Austin providers
- Verified rates and terms (as of Jan 2025)
- Mix of fixed, variable, and time-of-use structures

### C. Demo Video Checklist

**Pre-Recording:**
- [ ] Test all 5 customer scenarios end-to-end
- [ ] Verify OpenAI API responses are consistent and high-quality
- [ ] Confirm all calculations match expected values
- [ ] Practice script timing (aim for 8-9 minutes with buffer)
- [ ] Set up clean recording environment (no notification popups)

**Recording:**
- [ ] Use OBS or Loom for high-quality screen capture
- [ ] Record in 1080p or higher
- [ ] Separate audio track for voiceover flexibility
- [ ] Record b-roll of key moments for emphasis

**Post-Production:**
- [ ] Add transitions between scenarios
- [ ] Highlight key numbers (savings, costs) with subtle animations
- [ ] Add captions for accessibility
- [ ] Include title slide and credits
- [ ] Export in web-optimized format (H.264, 30fps)

---

## 15. Questions for Stakeholder Discussion

Post-demo, these questions should guide next steps:

1. **Market Validation:** Do the customer scenarios resonate with our target market?
2. **Business Model:** Should we pursue B2C, B2B, or both?
3. **Monetization:** Commission-only, or add premium subscription tier?
4. **Geographic Expansion:** Start with Austin/Texas, or multi-state from day one?
5. **Partnership Strategy:** Should we partner with utilities or compete with them?
6. **Feature Prioritization:** Which behavior optimization features should we build first?

---

**Document Version:** 2.0 (Video Demo)  
**Last Updated:** January 11, 2025  
**Author:** Mark (Gauntlet AI Bootcamp)  
**Next Milestone:** Record and submit demo video  

---

**END OF PRD**