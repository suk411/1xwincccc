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
  "channel": "gspayusdt"
}
```

| Param | Type | Required | Description |
|-------|------|---------|-------------|
| amount | number | Yes | Deposit amount in the channel's denomination (USDT for USDT, INR for others) |
| channel | string | Yes | Channel key from `/account/deposit-config` |

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

### Deposit Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Deposit initiated, awaiting payment |
| `SUCCESS` | Payment successful, amount credited |
| `FAILED` | Payment failed |
| `EXPIRED` | Payment link expired |
