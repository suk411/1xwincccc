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

## Initiate Deposit

```
POST /api/payment/deposit
```

**Body:**

```json
{
  "amount": 1000,
  "channel": "simplypay"
}
```

| Param | Type | Required | Description |
|-------|------|---------|-------------|
| amount | number | Yes | Deposit amount |
| channel | string | No | Channel: `simplypay` (default), `fpay`, `upay`, `gspayusdt`, `gspayinr` |

**Response (Success):**

```json
{
  "success": true,
  "paymentUrl": "https://...",
  "merOrderNo": "ODR1234567890123456",
  "amount": 1000,
  "currency": "INR",
  "status": "PENDING",
  "channel": "SimplyPay",
  "msg": "Redirect to paymentUrl"
}
```

### Available Channels

| Channel | Description |
|---------|-------------|
| `simplypay` | SimplyPay gateway (default) |
| `fpay` | FPay gateway |
| `upay` | UPay gateway |
| `gspayusdt` | GSPay USDT (crypto) |
| `gspayinr` | GSPay INR (fiat via XinPay) |

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
