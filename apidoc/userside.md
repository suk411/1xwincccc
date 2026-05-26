# Withdrawal API - User Side

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

## Payment Methods Management

### Add Payment Method

```
POST /account/payment-methods
```

**Description:** Add a withdrawal payment method (UPI / BANK / UPAY).

**Body (UPI):**

```json
{
  "type": "UPI",
  "upiId": "user@paytm",
  "holderName": "John Doe"
}
```

**Body (BANK):**

```json
{
  "type": "BANK",
  "accountNo": "1234567890",
  "ifsc": "SBIN0001234",
  "bankName": "State Bank of India",
  "holderName": "John Doe"
}
```

**Body (UPAY):**

```json
{
  "type": "UPAY",
  "rplId": "RPL123456",
  "holderName": "John Doe"
}
```

| Param | Type | Required | Description |
|-------|------|---------|-------------|
| type | string | Yes | `UPI`, `BANK`, or `UPAY` |
| upiId | string | For UPI | UPI ID (e.g., user@paytm) |
| accountNo | string | For BANK | Bank account number |
| ifsc | string | For BANK | IFSC code |
| bankName | string | For BANK | Bank name |
| rplId | string | For UPAY | RPL ID |
| holderName | string | Yes | Account/UPI holder name |

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "userId": 123456,
    "type": "UPI",
    "upiId": "user@paytm",
    "holderName": "John Doe",
    "isDefault": true,
    "isActive": true,
    "createdAt": "2026-03-19T10:30:00.000Z"
  }
}
```

**Notes:**
- First added method becomes default automatically
- BANK type also syncs to legacy `bindAccount` for backward compatibility
- Duplicate detection: same UPI ID / account number / RPL ID cannot be added twice

---

### Set Default Payment Method

```
PATCH /account/payment-methods/:id/default
```

**Description:** Set a payment method as the default for withdrawals.

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "type": "BANK",
    "accountNo": "xxxx7890",
    "isDefault": true
  }
}
```

---

## Withdraw Info

```
GET /account/withdraw-info
```

**Description:** Get withdrawal eligibility information including payment methods, balance, limits, and turnover progress.

**Response:**

```json
{
  "success": true,
  "data": {
    "paymentMethods": {
      "userId": 123456,
      "holderName": "John Doe",
      "bank": {
        "accountNo": "xxxx7890",
        "ifsc": "SBIN0001234",
        "bankName": "State Bank of India",
        "isDefault": true,
        "isActive": true,
        "createdAt": "2026-03-19T10:30:00.000Z",
        "updatedAt": "2026-03-19T10:30:00.000Z"
      },
      "upi": {
        "upiId": "use***@paytm",
        "isDefault": false,
        "isActive": true,
        "createdAt": "2026-03-19T11:00:00.000Z",
        "updatedAt": "2026-03-19T11:00:00.000Z"
      },
      "upay": {}
    },
    "limits": {
      "BANK": { "min": 110, "max": 50000 },
      "UPI": { "min": 300, "max": 15000 },
      "UPAY": { "min": 300, "max": 50000 },
      "perDay": 3,
      "usedToday": 1,
      "remainingToday": 2
    },
    "walletBalance": 1000.0,
    "gameBalance": 50.0,
    "totalAvailable": 1050.0,
    "turnover": {
      "total_required": 0,
      "requirement": 0,
      "completed": 0,
      "progress": 100,
      "canWithdraw": true
    },
    "chargeInfo": {
      "percentage": 0.035,
      "flat": 6,
      "description": "3.5% + 6 flat"
    }
  }
}
```

### Withdrawal Requirements

- At least one payment method must exist (UPI/BANK/UPAY)
- Turnover requirement must be 0 (`canWithdraw: true`)
- Amount must not exceed wallet balance
- Amount must be within min/max range of the selected payment type
- Maximum 3 withdrawal requests per day (only PENDING/AUDITING/SUCCESS count; CANCELLED/FAILED free up the slot)
- **No charge deducted upfront.** The 3.5% + ₹6 charge is only applied on admin approval if admin chooses "charge from user"

### Per-Type Limits

| Type | Min | Max |
|------|-----|-----|
| BANK | ₹110 | ₹50,000 |
| UPI | ₹300 | ₹15,000 |
| UPAY | ₹300 | ₹50,000 |

Admin can change these limits anytime via `GET/PUT /admin/withdrawal-config`.

---

## Request Withdrawal

```
POST /account/withdraw
```

**Description:** Submit a withdrawal request. Deducts only the amount from wallet (no charge). Admin decides who bears the charge on approval.

**Body:**

```json
{
  "amount": 1000,
  "type": "UPI"
}
```

| Param | Type | Required | Description |
|-------|------|---------|-------------|
| amount | number | Yes | Withdrawal amount (deducted from wallet) |
| type | string | No | `UPI`, `BANK`, or `UPAY` (uses default if not provided) |

**Response (Success):**

```json
{
  "status": "success",
  "msg": "Withdrawal request submitted",
  "orderId": "WD123456789012345",
  "amount": 1000,
  "newBalance": 9000,
  "paymentMethod": "UPI",
  "bankDetails": {
    "accountNumber": "user@paytm",
    "accountHolder": "John Doe"
  }
}
```

**Error (No payment method):**

```json
{
  "status": "failed",
  "msg": "No payment method found. Please add a payment method first."
}
```

---

## My Withdrawal Orders

```
GET /account/my-withdrawals?page=1&limit=25
```

**Response:**

```json
{
  "status": "success",
  "page": 1,
  "limit": 25,
  "total": 10,
  "items": [
    {
      "_id": "...",
      "orderId": "WD123456789012345",
      "userId": 123456,
      "amount": 1000,
      "charge": 41,
      "currency": "INR",
      "status": "PENDING",
      "paymentMethod": "UPI",
      "paymentDetails": {
        "upiId": "user@paytm",
        "holderName": "John Doe"
      },
      "channelName": "SimplyPay",
      "gatewayResponse": null,
      "note": "Customer requested cancellation via support",
      "createdAt": "2026-03-19T10:30:00.000Z"
    }
  ]
}
```

### Withdrawal Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Request submitted, awaiting admin approval |
| `AUDITING` | Admin approved, processing with payment gateway (SimplyPay/Upay) |
| `SUCCESS` | Withdrawal completed successfully |
| `FAILED` | Payment failed (amount auto-refunded — charge was never deducted) |
| `CANCELLED` | Order cancelled by admin (full amount returned — no charge to refund). Admin's cancellation note visible in `note` field |

---

## Bind Bank Account (Legacy)

```
POST /account/bind-bank
```

**Description:** Legacy endpoint. Use `POST /account/payment-methods` with `type: "BANK"` instead.

**Body:**

```json
{
  "bankName": "SBI",
  "bankCode": "SBI",
  "accountNumber": "1234567890",
  "accountHolder": "John Doe"
}
```
