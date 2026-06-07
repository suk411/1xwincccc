# Deposit API - User Side

## Base URL

```
https://backend-ledger-0ra6.onrender.com/api
```

## Authentication

All endpoints require Bearer token:

```
Authorization: Bearer <user_token>
```

---

## Deposit Page Config

Get available deposit channels with their min/max limits and exchange rates. Frontend should call this on page load instead of hardcoding channels.

```
GET /account/deposit-config
```

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "channel": "simplypay",
      "name": "SimplyPay",
      "isActive": true,
      "minAmount": 100,
      "maxAmount": 100000,
      "exchangeRate": 1,
      "sortOrder": 0
    },
    {
      "channel": "usdt",
      "name": "USDT",
      "isActive": true,
      "minAmount": 1,
      "maxAmount": 1000,
      "exchangeRate": 90,
      "sortOrder": 2
    }
  ]
}
```

Only active channels (`isActive: true`) are returned.

- For INR channels, `exchangeRate` is 1 (amount = received amount).
- For USDT, `exchangeRate` is the current rate (e.g., 90). The frontend should show: *"You deposit X USDT → You receive Y INR"* where `Y = X * exchangeRate`.

---

## Initiate Deposit

```
POST /api/payment/deposit
```

**Body:**

```json
{
  "amount": 10,
  "channel": "gspayusdt",
  "bonusOptIn": true
}
```

| Param | Type | Required | Description |
|-------|------|---------|-------------|
| amount | number | Yes | Deposit amount in the channel's denomination (USDT for USDT, INR for others) |
| channel | string | Yes | Channel key from `/account/deposit-config` |
| bonusOptIn | boolean | No | Set `true` to opt into deposit bonus (first 3 deposits only). Default: `false` |

**Validation (server-enforced):**
- Channel must exist and be `isActive: true`
- Amount must be within `minAmount`–`maxAmount` range of the selected channel

**Exchange Rate & receivedAmount:**
- For USDT: `receivedAmount = amount × exchangeRate` (e.g., 10 USDT × 90 = 900 INR)
- For INR channels: `receivedAmount = amount` (exchangeRate = 1)
- The wallet is credited with `receivedAmount` in INR

**Response (Success):**

```json
{
  "status": "success",
  "msg": "Redirect to paymentUrl",
  "paymentUrl": "https://..."
}
```

**Error (disabled channel):**

```json
{
  "success": false,
  "msg": "Channel is currently disabled",
  "status": "failed"
}
```

**Error (amount out of range):**

```json
{
  "success": false,
  "msg": "Minimum deposit for USDT is 1",
  "status": "failed"
}
```

---

## My Deposit Records

```
GET /account/my-deposits
```

**Query Params:** page, limit

**Response:**

```json
{
  "success": true,
  "items": [
    {
      "userId": 123456,
      "type": "DEPOSIT",
      "amount": 500.0,
      "balanceAfter": 1500.0,
      "status": "SUCCESS",
      "orderId": "DEP123456",
      "remark": "Deposit via Paysimply",
      "createdAt": "2026-03-15T10:30:00.000Z"
    }
  ]
}
```

---

## Deposit Bonus Info

Shows available bonus rates and remaining bonus eligibility for the current user.

```
GET /account/deposit-bonus-info
```

**Response:**

```json
{
  "status": "success",
  "hasBonusAvailable": true,
  "nextDepositCount": 2,
  "nextBonusRate": 0.5,
  "nextBonusExample": "Deposit ₹200 → get ₹100 bonus",
  "turnoverMultiplier": 7,
  "successfulDeposits": 1,
  "allRates": [
    { "depositCount": 1, "bonusRate": 1.0 },
    { "depositCount": 2, "bonusRate": 0.5 },
    { "depositCount": 3, "bonusRate": 0.3 }
  ]
}
```

| Field | Description |
|-------|-------------|
| `hasBonusAvailable` | Whether user can still claim a bonus (within first 3 deposits) |
| `nextDepositCount` | Which deposit number the next bonus would apply to (1, 2, or 3) |
| `nextBonusRate` | The bonus rate for the next eligible deposit |
| `nextBonusExample` | Human-readable example of what the next bonus would be |
| `turnoverMultiplier` | Current turnover multiplier for deposit bonus |
| `successfulDeposits` | Number of successful deposits the user has made |
| `allRates` | All configured bonus rates |

### Deposit Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Deposit initiated, awaiting payment |
| `SUCCESS` | Payment successful, amount credited |
| `FAILED` | Payment failed |
| `EXPIRED` | Payment link expired |
