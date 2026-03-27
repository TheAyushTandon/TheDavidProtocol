# 🔐 David Protocol — Access Tree & Token Management Design

## 🧠 Goal
Efficiently manage:
- API Tokens (Plaid, Gemini)
- Avoid repeated full pipeline execution
- Cache results smartly

---

## 🌳 Access Tree Architecture

```
User Request
     ↓
 Auth Layer (JWT / Session)
     ↓
 Token Manager
     ↓
 ┌─────────────────────────────┐
 │   Access Tree Controller    │
 └─────────────────────────────┘
     ↓
 ┌───────────────┬───────────────┬───────────────┐
 │ Cached Data   │ Partial Run   │ Full Run      │
 └───────────────┴───────────────┴───────────────┘
```

---

## 🔑 Token Storage Strategy

### Tokens to Store:
- Plaid Access Token
- Gemini API Key (server-side only)

### Storage:
- Use environment variables for Gemini
- Use encrypted DB storage for Plaid tokens

### Example:
```
users_table:
  user_id
  plaid_access_token (encrypted)
  last_sync_time
```

---

## 🌲 Access Tree Logic

### Step 1: Check Cache
- If transactions already processed → return stored result

### Step 2: Check Freshness
- If last sync < threshold (e.g., 24h) → skip reprocessing

### Step 3: Partial Update
- Fetch only new transactions
- Update features incrementally

### Step 4: Full Pipeline (only if needed)
- Run NLP + Feature Engineering + Scoring

---

## ⚡ Caching Layers

| Layer | What to Cache | Why |
|------|-------------|-----|
| Transactions | Raw + categorized | Avoid re-fetch |
| Features | Computed metrics | Avoid recompute |
| Scores | Final output | Instant response |

---

## 🔁 Smart Recompute Strategy

| Condition | Action |
|----------|--------|
| New transactions | Partial recompute |
| No change | Return cached score |
| Major change | Full recompute |

---

## 🧩 Implementation (FastAPI)

### Middleware:
- Check token validity
- Attach user context

### Service Layer:
```
if cached_score_exists and fresh:
    return cached_score
elif new_transactions:
    update_features()
    recompute_score()
else:
    full_pipeline()
```

---

## 🔐 Security Best Practices

- Encrypt Plaid tokens (AES)
- Never expose Gemini key to frontend
- Use HTTPS only
- Rotate tokens periodically

---

## 🚀 Benefits

- ⚡ Faster responses
- 💸 Lower API cost (Gemini calls reduced)
- 🔁 Efficient updates (no full rerun)
- 🔐 Secure token handling

---

## 🔥 Final Insight

**Access Tree = Smart decision system**

Instead of:
> Always recompute everything ❌

You do:
> Check → Reuse → Update only what changed ✅
