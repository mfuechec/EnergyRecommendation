# Onboarding Flow - UI Specification

**Purpose:** Collect essential user context to enable personalized AI recommendations
**Duration:** 2-3 minutes
**Completion Rate Target:** >85%
**Mobile Responsive:** Yes

---

## Design Principles

1. **Progressive Disclosure** - Ask only essential questions upfront
2. **Visual Over Text** - Use icons, images, and interactive elements
3. **Smart Defaults** - Pre-select most common options
4. **Skip-Friendly** - Allow users to skip optional questions
5. **Contextual Help** - Explain why we're asking each question

---

## Flow Overview

```
Landing Page
    ↓
Step 1: Connect Account (Required)
    ↓
Step 2: About Your Home (Required)
    ↓
Step 3: What Matters Most (Required)
    ↓
Dashboard (Ready to get recommendations!)
```

**Total Questions:** 7-9 (depending on answers)
**Required Fields:** 5
**Optional Fields:** 2-4

---

## Landing Page

### Layout
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ⚡ Arbor Energy                      │
│                                                         │
│         Smart Energy Recommendations Powered by AI      │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  📊  Find Better Plans                            │ │
│  │      AI analyzes your usage to find savings       │ │
│  │                                                   │ │
│  │  💡  Optimize Your Usage                          │ │
│  │      Get personalized tips to reduce costs        │ │
│  │                                                   │ │
│  │  🌱  Go Green                                     │ │
│  │      Switch to renewable energy easily            │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│              [Get Started - It's Free]                  │
│                                                         │
│                    Takes 2 minutes                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "Smart Energy Recommendations Powered by AI"
- Subheadline: "Save money, go green, or both. We'll find the perfect plan for you."
- CTA: "Get Started - It's Free"
- Below CTA: "Takes 2 minutes"

---

## Step 1: Connect Your Account

### For Demo: Customer Selection Dropdown

**Demo-Specific UI:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Step 1 of 3: Connect Your Account                     │
│  ═══════════════════════                                │
│                                                         │
│  For this demo, select a customer profile:             │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Sarah Mitchell                               ▼ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Customer Profiles:                                     │
│  • Sarah Mitchell - Loyal customer, 4 years same plan  │
│  • Mike Rodriguez - Work from home, variable rates     │
│  • David Park - Solar owner                            │
│  • Jessica Chen - Tesla owner                          │
│  • Thompson Family - Pool owners                       │
│                                                         │
│                                    [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### For Production: Real Account Connection

**Production UI:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Step 1 of 3: Connect Your Account                     │
│  ═══════════════════════                                │
│                                                         │
│  We'll securely import your energy usage data          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  🏢  Austin Energy                                │  │
│  │      Most popular for Austin residents           │  │
│  │                                    [Connect] ────►│  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Or enter manually:                              │  │
│  │                                                  │  │
│  │  Account Number: [____________________]          │  │
│  │  ZIP Code:       [_______]                       │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  🔒 Your data is encrypted and never shared            │
│                                                         │
│                                    [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "Connect Your Account"
- Subheadline: "We'll securely import your energy usage data"
- Security note: "🔒 Your data is encrypted and never shared"
- Button: "Connect" (for OAuth) or "Continue" (for manual entry)

**Technical:**
- OAuth flow with Austin Energy / Green Button API
- Fallback to manual account number entry
- ZIP code validates service area
- Loading state: "Importing your usage data..." (3-5 seconds)

---

## Step 2: About Your Home

### Question 2.1: Special Equipment (Required)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Step 2 of 3: About Your Home                          │
│           ═══════════════════════                       │
│                                                         │
│  Do you have any of these?                             │
│  (Select all that apply)                               │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │    ☀️    │  │    🚗    │  │    🏊    │             │
│  │  Solar   │  │Electric  │  │   Pool   │             │
│  │  Panels  │  │ Vehicle  │  │          │             │
│  │          │  │          │  │          │             │
│  │   [ ]    │  │   [ ]    │  │   [ ]    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  ┌──────────┐                                          │
│  │    ♨️    │                                          │
│  │ Hot Tub  │                                          │
│  │          │                                          │
│  │   [ ]    │                                          │
│  └──────────┘                                          │
│                                                         │
│  ℹ️  This helps us find plans optimized for your setup │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "Do you have any of these?"
- Subheadline: "(Select all that apply)"
- Help text: "ℹ️ This helps us find plans optimized for your setup"
- Options: Solar Panels, Electric Vehicle, Pool, Hot Tub
- Each option has icon and checkbox

**Conditional Logic:**
- If **Solar** selected → Show Question 2.2 (Solar Details)
- If **EV** selected → Show Question 2.3 (EV Details)
- If **Pool** selected → Show Question 2.4 (Pool Details)
- If none selected → Skip to Question 2.5

---

### Question 2.2: Solar Details (Conditional)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Tell us about your solar system                       │
│                                                         │
│  System Size (kW):                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │ [8.5]  kW                                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  When was it installed?                                │
│  ┌────────────────────────────────────────────────┐    │
│  │ [November 2022]                            ▼   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Approximate investment:                               │
│  ┌────────────────────────────────────────────────┐    │
│  │ $[18,000]                                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ℹ️  We'll find plans with the best buyback rates      │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "Tell us about your solar system"
- Fields: System size (kW), Install date, Investment amount (optional)
- Help text: "ℹ️ We'll find plans with the best buyback rates"

---

### Question 2.3: EV Details (Conditional)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Tell us about your electric vehicle                   │
│                                                         │
│  Vehicle:                                              │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Tesla Model 3]                            ▼   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  When do you typically charge?                         │
│                                                         │
│  ( ) Overnight (11pm - 7am)       ← Recommended       │
│  ( ) Evening (6pm - 11pm)                              │
│  ( ) Daytime (varies)                                  │
│  ( ) Whenever it's convenient                          │
│                                                         │
│  Where do you charge?                                  │
│  ( ) Home - Level 2 charger                            │
│  ( ) Home - Standard outlet                            │
│  ( ) Public charging stations                          │
│                                                         │
│  ℹ️  We'll find plans that reward off-peak charging    │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "Tell us about your electric vehicle"
- Fields: Vehicle model, Charging time, Charging location
- Help text: "ℹ️ We'll find plans that reward off-peak charging"
- Smart label: "Overnight (11pm - 7am) ← Recommended"

---

### Question 2.4: Pool Details (Conditional)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Tell us about your pool                               │
│                                                         │
│  Approximate size:                                     │
│  ( ) Small (< 15,000 gallons)                          │
│  ( ) Medium (15,000 - 25,000 gallons)                  │
│  ( ) Large (> 25,000 gallons)                          │
│                                                         │
│  Equipment:                                            │
│  [x] Pump                                              │
│  [ ] Heater                                            │
│  [ ] Automatic cleaner                                 │
│                                                         │
│  When does your equipment run?                         │
│  ( ) During the day (most expensive)                   │
│  ( ) Evening hours                                     │
│  ( ) Overnight (most efficient)                        │
│  ( ) Not sure                                          │
│                                                         │
│  ℹ️  We'll show you how to save with a simple timer    │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "Tell us about your pool"
- Fields: Size, Equipment type, Operation schedule
- Help text: "ℹ️ We'll show you how to save with a simple timer"

---

### Question 2.5: Basic Home Info (Required)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  A few quick questions about your home                 │
│                                                         │
│  Home type:                                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Single Family Home]                       ▼   │    │
│  └────────────────────────────────────────────────┘    │
│  Options: Single Family, Townhouse, Condo, Apartment   │
│                                                         │
│  How many people live here?                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ [2]                                            │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Do you work from home?                                │
│  ( ) Yes, full-time                                    │
│  ( ) Yes, part-time                                    │
│  ( ) No                                                │
│                                                         │
│  ℹ️  This helps us understand your usage pattern       │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "A few quick questions about your home"
- Fields: Home type, Occupants, Work from home status
- Help text: "ℹ️ This helps us understand your usage pattern"

---

## Step 3: What Matters Most

### Question 3.1: Primary Concern (Required)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Step 3 of 3: What Matters Most                        │
│                ═══════════════════════                  │
│                                                         │
│  What's most important to you?                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💰  Save Money                                 │   │
│  │      Find the absolute cheapest plan            │   │
│  │                                        ( )      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🌱  Go Green                                   │   │
│  │      Maximize renewable energy                  │   │
│  │                                        ( )      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔄  Stay Flexible                              │   │
│  │      Avoid long-term contracts                  │   │
│  │                                        ( )      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ⚖️   Balanced Approach                         │   │
│  │      Consider cost, green, and flexibility      │   │
│  │                                        (•)      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "What's most important to you?"
- Options:
  - 💰 Save Money - "Find the absolute cheapest plan"
  - 🌱 Go Green - "Maximize renewable energy"
  - 🔄 Stay Flexible - "Avoid long-term contracts"
  - ⚖️ Balanced Approach - "Consider cost, green, and flexibility" (default)

**Default:** Balanced Approach (pre-selected)

---

### Question 3.2: Renewable Energy Priority (Required)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  How important is renewable energy to you?             │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  Low        Moderate        High       100%     │  │
│  │   ○────────────●──────────────○─────────○       │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Moderate: I prefer renewable but cost matters too     │
│                                                         │
│  We'll prioritize plans with at least 50% renewable    │
│  energy, balanced with competitive pricing.            │
│                                                         │
│  ℹ️  Moving the slider changes our recommendation      │
│     weighting                                          │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "How important is renewable energy to you?"
- Slider with 4 positions:
  - Low (0-25% renewable acceptable)
  - Moderate (50%+ renewable preferred) ← Default
  - High (75%+ renewable strongly preferred)
  - 100% (only 100% renewable plans)
- Dynamic explanation text updates based on slider position
- Help text: "ℹ️ Moving the slider changes our recommendation weighting"

---

### Question 3.3: Contract Flexibility (Required)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  What's the longest contract you'd consider?           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🚫  No Contract (Month-to-Month)               │   │
│  │      Cancel anytime, maximum flexibility        │   │
│  │                                        ( )      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📅  6 Months                                   │   │
│  │      Short commitment, decent rates             │   │
│  │                                        ( )      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📅  12 Months                                  │   │
│  │      Best balance of rate and flexibility       │   │
│  │                                        (•)      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📅  24 Months                                  │   │
│  │      Lowest rates, long-term price lock         │   │
│  │                                        ( )      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                   [Back]           [Continue]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Copy:**
- Headline: "What's the longest contract you'd consider?"
- Options: No contract, 6 months, 12 months (default), 24 months
- Each option has brief explanation

**Default:** 12 months

---

## Completion Screen

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                       ✅                                │
│                                                         │
│                  You're All Set!                        │
│                                                         │
│  We're analyzing your usage data and comparing         │
│  20 energy plans to find your best options.            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  [████████████░░░░░░░░░░░░] 60%                 │  │
│  │                                                  │  │
│  │  Analyzing usage patterns...                    │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  This should take about 5 seconds                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Loading states (sequential):**
1. "Loading your usage data..." (1 second)
2. "Analyzing usage patterns..." (1 second)
3. "Calculating costs for 20 plans..." (1.5 seconds)
4. "Ranking best fits for you..." (1 second)
5. "Generating recommendations..." (1 second)
6. Redirect to Dashboard

---

## Data Mapping

### Fields → Database Schema

| UI Field | JSON Field | Required | Default |
|----------|------------|----------|---------|
| Customer selection (demo) | customer_id | Yes | - |
| Solar panels checkbox | has_solar | Yes | false |
| Solar system size | solar_system_kw | Conditional | null |
| Solar install date | solar_install_date | Conditional | null |
| Solar investment | solar_investment_amount | No | null |
| EV checkbox | has_ev | Yes | false |
| EV model | ev_make_model | Conditional | null |
| EV charging time | ev_typical_charging_time | Conditional | null |
| EV charging location | ev_charging_location | Conditional | null |
| Pool checkbox | has_pool | Yes | false |
| Pool size | pool_size_gallons | Conditional | null |
| Pool equipment | pool_equipment | Conditional | null |
| Pool schedule | pool_equipment_schedule | Conditional | null |
| Home type | home_type | Yes | "single_family" |
| Occupants | occupants | Yes | 2 |
| Work from home | work_from_home | Yes | false |
| Primary concern | primary_concern | Yes | "balanced" |
| Renewable priority | renewable_priority | Yes | "moderate" |
| Max contract | max_contract_months | Yes | 12 |

---

## Validation Rules

### Required Field Validation
- Must select at least one option in Step 3.1 (Primary Concern)
- Must select renewable priority in Step 3.2
- Must select contract length in Step 3.3

### Conditional Required Fields
- If solar = true: `solar_system_kw` required
- If EV = true: `ev_make_model` and `ev_charging_location` required
- If pool = true: `pool_size_gallons` required

### Data Type Validation
- `occupants`: Integer, 1-20
- `solar_system_kw`: Float, 0.1-50.0
- `pool_size_gallons`: Integer, 1000-100000
- `solar_investment_amount`: Integer, 0-500000

---

## Mobile Responsive Considerations

### Breakpoints
- **Desktop (>1024px):** Side-by-side cards
- **Tablet (768-1024px):** Stacked cards, full width
- **Mobile (<768px):** Simplified layout, larger touch targets

### Mobile Optimizations
- Radio buttons → Full-width tappable cards
- Sliders → Larger touch area (48px minimum)
- Text inputs → Mobile-optimized keyboards (numeric for numbers)
- Progress indicator always visible at top
- Back button in navigation bar

---

## Accessibility

### WCAG 2.1 AA Compliance
- All form fields have associated labels
- Color not sole indicator (icons + text)
- Keyboard navigation support
- Screen reader announcements for progress
- Minimum contrast ratio 4.5:1
- Focus indicators clearly visible
- Error messages descriptive and helpful

### ARIA Labels
```html
<div role="progressbar" aria-valuenow="2" aria-valuemin="1" aria-valuemax="3" aria-label="Step 2 of 3">
```

---

## Error Handling

### Validation Errors
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️  Please select at least one option                  │
└─────────────────────────────────────────────────────────┘
```

### Network Errors
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️  We couldn't connect to your utility account.       │
│     Please try again or enter your info manually.       │
│                                                         │
│                      [Try Again]  [Manual Entry]        │
└─────────────────────────────────────────────────────────┘
```

---

## Analytics Events

Track these events for funnel optimization:

1. `onboarding_started`
2. `step_1_completed` (account connected)
3. `step_2_started`
4. `special_equipment_selected` (with type: solar/ev/pool)
5. `step_2_completed`
6. `step_3_started`
7. `step_3_completed`
8. `onboarding_completed`
9. `onboarding_abandoned` (with last_step)

**Key Metrics:**
- Completion rate (target >85%)
- Time to complete (target <3 minutes)
- Drop-off points
- Most common equipment selections

---

## Copy Variations for A/B Testing

### Primary Concern Headline
- **Variant A:** "What's most important to you?"
- **Variant B:** "What's your priority?"
- **Variant C:** "Help us personalize your recommendations"

### CTA Button Text
- **Variant A:** "Continue"
- **Variant B:** "Next"
- **Variant C:** "Next Step →"

---

## Future Enhancements (Post-Demo)

1. **Smart Pre-Fill** - Detect EV from VIN or license plate lookup
2. **Utility Integration** - Real OAuth with Green Button API
3. **Address Autocomplete** - Google Places API
4. **Photo Upload** - OCR for solar inverter specs
5. **Estimated Savings Preview** - Show "You could save ~$400/year" before completion
6. **Social Proof** - "Join 10,000+ Austin residents saving money"

---

**Document Version:** 1.0
**Last Updated:** January 11, 2025
**Author:** Winston, System Architect
