# Agency System API Documentation

## Base URL

```
https://backend-ledger-0ra6.onrender.com/api
```

## Authentication

Agent-facing endpoints require Bearer token:

```
Authorization: Bearer <user_token>
```

Admin endpoints require Bearer token + admin privileges.

---

## 1. Agent Level & Stats

### Get My Agency Level

```
GET /agency/level
```

**Response:**

```json
{
  "status": "success",
  "rebate_level": 3,
  "teamMembers": 22,
  "teamBets": 3120000,
  "teamDeposit": 680000,
  "todayBets": 15000,
  "todayDeposit": 5000,
  "todayRegs": 3
}
```

| Field | Description |
|---|---|
| `rebate_level` | Current rebate level (0–10) |
| `teamMembers` | Lifetime unique team members (L1+L2+L3) |
| `teamBets` | Lifetime cumulative team betting amount |
| `teamDeposit` | Lifetime cumulative team deposit amount |
| `todayBets` | Today's total bets from team |
| `todayDeposit` | Today's total deposits from team |
| `todayRegs` | Today's new registrations from team |

---

### Get My Daily Stats

```
GET /agency/daily?date=2026-05-24
```

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `date` | String | No | Date in YYYY-MM-DD format (defaults to today) |

**Response:**

```json
{
  "status": "success",
  "date": "2026-05-24T00:00:00.000Z",
  "level1": { "bets": 10000, "deposit": 5000, "regCount": 2, "depositCount": 3, "firstDepositCount": 1 },
  "level2": { "bets": 4000, "deposit": 0, "regCount": 1, "depositCount": 0, "firstDepositCount": 0 },
  "level3": { "bets": 1000, "deposit": 0, "regCount": 0, "depositCount": 0, "firstDepositCount": 0 }
}
```

| Field | Description |
|---|---|
| `level1.bets` | Today's total bet amount from direct (L1) team |
| `level1.deposit` | Today's total deposit amount from L1 team |
| `level1.regCount` | Today's new L1 registrations |
| `level1.depositCount` | Today's number of L1 deposit transactions |
| `level1.firstDepositCount` | Today's number of L1 first-time depositors |

---

### Get My Commission History

```
GET /agency/commissions?page=1&limit=25
```

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `page` | Number | No | Page number (default: 1) |
| `limit` | Number | No | Items per page (max: 100, default: 25) |

**Response:**

```json
{
  "status": "success",
  "total": 15,
  "page": 1,
  "limit": 25,
  "items": [
    {
      "_id": "...",
      "userId": 32545513,
      "date": "2026-05-24T00:00:00.000Z",
      "rebateLevel": 3,
      "l1Bets": 10000,
      "l2Bets": 4000,
      "l3Bets": 1000,
      "l1Rate": 0.008,
      "l2Rate": 0.0032,
      "l3Rate": 0.00128,
      "l1Amount": 80,
      "l2Amount": 12.8,
      "l3Amount": 1.28,
      "totalAmount": 94.08,
      "status": "CREDITED",
      "creditedAt": "2026-05-24T00:00:00.000Z",
      "createdAt": "2026-05-24T00:00:00.000Z"
    }
  ]
}
```

| Field | Description |
|---|---|
| `rebateLevel` | The rebate level used for this calculation |
| `l1Bets` | L1 bets used in calculation |
| `l1Rate` | L1 rebate rate applied |
| `l1Amount` | Commission earned from L1 = l1Bets × l1Rate |
| `totalAmount` | Total commission = l1Amount + l2Amount + l3Amount |
| `status` | `CREDITED` = already credited to wallet |

---

## 2. Rebate Levels Reference

The following table shows the 11 rebate levels (L0–L10), their requirements, and commission rates:

| Level | Team Members | Team Bets | Team Deposit | L1 Rate | L2 Rate | L3 Rate |
|-------|-------------|-----------|-------------|---------|---------|---------|
| L0 | 0 | 0 | 0 | 0.600% | 0.180% | 0.054% |
| L1 | 5 | 500K | 100K | 0.700% | 0.245% | 0.08575% |
| L2 | 10 | 1,000K | 200K | 0.750% | 0.28125% | 0.105469% |
| L3 | 15 | 2,500K | 500K | 0.800% | 0.320% | 0.128% |
| L4 | 20 | 3,500K | 700K | 0.850% | 0.36125% | 0.153531% |
| L5 | 25 | 5,000K | 1,000K | 0.900% | 0.405% | 0.18225% |
| L6 | 30 | 10,000K | 2,000K | 1.000% | 0.500% | 0.250% |
| L7 | 100 | 100,000K | 20,000K | 1.100% | 0.605% | 0.33275% |
| L8 | 500 | 500,000K | 100,000K | 1.200% | 0.720% | 0.432% |
| L9 | 1,000 | 1,000,000K | 200,000K | 1.300% | 0.845% | 0.54925% |
| L10 | 5,000 | 1,500,000K | 300,000K | 1.400% | 0.980% | 0.686% |

**How commission is calculated (at midnight):**

```
Commission = (L1 total bets × L1 rate) + (L2 total bets × L2 rate) + (L3 total bets × L3 rate)
```

Commission is **auto-credited** to wallet — no manual claim needed.

---

## 3. Team Members

### View My Team

```
GET /agency/team?tier=1&userId=32545514&fromDate=2026-01-01&toDate=2026-05-24&page=1&limit=25
```

Shows all users in your downline (L1/L2/L3) with optional filters.

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `tier` | Number (1/2/3) | No | Filter by downline level |
| `userId` | Number | No | Search a specific user |
| `fromDate` | Date | No | Registration start date |
| `toDate` | Date | No | Registration end date |
| `page` | Number | No | Default 1 |
| `limit` | Number | No | Max 100, default 25 |

**Response:**

```json
{
  "status": "success",
  "total": 50,
  "page": 1,
  "limit": 25,
  "items": [
    {
      "userId": 32545514,
      "mobile": "98***10",
      "registeredAt": "2026-01-15T10:30:00.000Z",
      "tier": 1,
      "totalDeposit": 15000
    }
  ]
}
```

| Field | Description |
|---|---|
| `mobile` | Masked: first 2 + `***` + last 2 digits |
| `tier` | 1 = direct, 2 = indirect, 3 = 3rd level |
| `totalDeposit` | User's lifetime total deposit amount |

---

## 4. Admin Endpoints

Requires admin Bearer token.

### Get All Level Configs

```
GET /agency/configs
```

**Response:**

```json
{
  "status": "success",
  "configs": [
    { "level": 0, "minMembers": 0, "minBets": 0, "minDeposit": 0, "l1Rate": 0.006, "l2Rate": 0.0018, "l3Rate": 0.00054 },
    { "level": 1, "minMembers": 5, "minBets": 500000, "minDeposit": 100000, "l1Rate": 0.007, ... }
  ]
}
```

### Update a Level Config

```
PUT /agency/configs/:level
```

**Body:**

```json
{
  "minMembers": 10,
  "minBets": 1000000,
  "minDeposit": 200000,
  "l1Rate": 0.0075,
  "l2Rate": 0.0028125,
  "l3Rate": 0.00105469
}
```

### Seed Default Configs

```
POST /agency/configs/seed
```

Resets all level configs to default values (L0–L10).

### Get Any Agent's Level (Admin)

```
GET /agency/admin/level?userId=32545513
```

### Get Any Agent's Daily Stats (Admin)

```
GET /agency/admin/daily?userId=32545513&date=2026-05-24
```

### View Any Agent's Team (Admin)

```
GET /agency/admin/team?agentId=32545513&tier=1&userId=32545514&fromDate=2026-01-01&toDate=2026-05-24&page=1&limit=25
```

| Param | Type | Required | Description |
|---|---|---|---|
| `agentId` | Number | Yes | Agent whose team to view |
| `tier` | Number (1/2/3) | No | Filter by downline level |
| `userId` | Number | No | Search a specific user |
| `fromDate` | Date | No | Registration start date |
| `toDate` | Date | No | Registration end date |
| `page` | Number | No | Default 1 |
| `limit` | Number | No | Max 100, default 25 |

**Response:** Same as agent team endpoint.

### Run Midnight Batch Manually (Admin)

```
POST /agency/admin/run-midnight
```

Triggers the midnight commission calculation immediately. Useful for testing.

**Response:**

```json
{
  "status": "success",
  "processed": 150,
  "totalCommission": 4523.5
}
```

---

## 4. How It Works (Summary for Frontend)

1. **Real-time tracking**: Every bet, deposit, and registration by a user automatically updates their ancestors' daily tally counters. No action needed from the agent.

2. **Midnight auto-credit**: At 12:00 AM IST, the system:
   - Reads all daily tallies
   - Determines each agent's rebate level based on cumulative team stats
   - Calculates commission using the formula above
   - Credits commission directly to wallet balance
   - Saves a commission record for history

3. **Agent does nothing**: No claim button. Commission appears in wallet automatically after midnight.
