# Wingo API Documentation

## Base URL

```
https://backend-ledger-0ra6.onrender.com/api/wingo
```

---

## 1. Game Sync (Current Round)

Returns the current active round with previous/next round timings. Frontend calls this first to start countdown.

**Endpoint:** `GET /api/wingo/current`

**Authentication:** None

### Response Example

```json
{
  "gameCode": "WinGo_30S",
  "intervalMinute": 0.5,
  "state": 1,
  "previous": {
    "issueNumber": "202605100000001",
    "startTime": 1777274760000,
    "endTime": 1777274790000
  },
  "current": {
    "issueNumber": "202605100000002",
    "startTime": 1777274790000,
    "endTime": 1777274820000
  },
  "next": {
    "issueNumber": "202605100000003",
    "startTime": 1777274820000,
    "endTime": 1777274850000
  }
}
```

### Fields

| Field          | Description                            |
| -------------- | -------------------------------------- |
| intervalMinute | Round duration (0.5 = 30s)             |
| state          | Game state (1 = running)               |
| previous       | Finished round details                 |
| current        | Active betting round — use issueNumber |
| next           | Upcoming round                         |

---

## 2. Place a Bet

Places a bet on the current active round. Rejects if round is closed or betting period has ended.

**Endpoint:** `POST /api/wingo/bet`

**Authentication:** Bearer token

### Request Body

| Field       | Type   | Required | Description                                                                 |
| ----------- | ------ | -------- | --------------------------------------------------------------------------- |
| issueNumber | string | Yes      | Must match current round from `/current`                                    |
| betamount   | number | Yes      | Amount to bet (minimum 1)                                                   |
| selectType  | string | Yes      | One of: number `0`-`9`, size `big`/`small`, or color `red`/`green`/`violet` |

### Valid selectType Values

| Category | Values                                           |
| -------- | ------------------------------------------------ |
| Number   | `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` |
| Size     | `big`, `small`                                   |
| Color    | `red`, `green`, `violet`                         |

### Request Example

```json
{
  "issueNumber": "20260502302413",
  "betamount": 100,
  "selectType": "red"
}
```

### Response (201 Created)

```json
{
  "status": "success"
}
```

### Error Responses

**400 - Round mismatch**

```json
{
  "status": "failed",
  "msg": "Bet must be placed on the current round only"
}
```

**400 - Betting period closed**

```json
{
  "status": "failed",
  "msg": "Betting closed for this round"
}
```

**400 - Insufficient balance**

```json
{
  "status": "failed",
  "msg": "Insufficient balance"
}
```

**400 - Duplicate bet**

```json
{
  "status": "failed",
  "msg": "Bet already placed for this issue and selection"
}
```

**400 - Invalid input**

```json
{
  "status": "failed",
  "msg": "issueNumber, betamount, and selectType are required"
}
```

**401 - Missing token**

```json
{
  "msg": "Authentication token is missing",
  "status": "failed"
}
```

---

## 3. Get User Bets

Returns the authenticated user's bet history with pagination.

**Endpoint:** `GET /api/wingo/bets`

**Authentication:** Bearer token

### Query Parameters

| Parameter   | Type   | Required | Description                            |
| ----------- | ------ | -------- | -------------------------------------- |
| page        | number | No       | Page number (default: 1)               |
| limit       | number | No       | Items per page (default: 25, max: 100) |
| status      | string | No       | Filter: `pending`, `won`, `lost`       |
| issueNumber | string | No       | Filter by specific issue               |

### Response Example

```json
{
  "status": "success",
  "page": 1,
  "limit": 25,
  "total": 10,
  "items": [
    {
      "issueNumber": "20260502302413",
      "orderNumber": "WG2026050220061393502417",
      "betamount": 100,
      "fee": 2,
      "realAmount": 98,
      "selectType": "red",
      "status": "won",
      "result": {
        "number": "0",
        "selectType": "red",
        "colour": "red,violet",
        "premium": "51250",
        "profitAmount": 196,
        "timestamp": "2026-05-02 20:06:13"
      },
      "timestamp": "2026-05-02 20:06:13"
    }
  ]
}
```

---

## 4. Draw History

Returns paginated draw results with winning numbers.

**Endpoint:** `GET /api/wingo/history`

**Authentication:** None

### Query Parameters

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| pageNo    | number | No       | Page number (default: 1) |

### Response Example

```json
{
  "data": {
    "list": [
      { "issueNumber": "202605100000010", "number": 7 },
      { "issueNumber": "202605100000009", "number": 3 }
    ],
    "pageNo": 1,
    "totalPage": 50,
    "totalCount": 500
  },
  "code": 0,
  "msg": "Succeed",
  "msgCode": 0,
  "serviceTime": 1777274817271
}
```

---

## 5. Trend Statistics

Returns statistical data for each number (0-9) to show hot/cold patterns.

**Endpoint:** `GET /api/wingo/trends`

**Authentication:** None

### Response Example

```json
{
  "data": [
    {
      "number": 0,
      "missingCount": 7,
      "avgMissing": 8,
      "openCount": 10,
      "maxContinuous": 1
    },
    {
      "number": 1,
      "missingCount": 10,
      "avgMissing": 7,
      "openCount": 11,
      "maxContinuous": 2
    }
  ],
  "code": 0,
  "msg": "Succeed",
  "msgCode": 0,
  "serviceTime": 1777280610983
}
```

### Fields

| Field         | Description                           |
| ------------- | ------------------------------------- |
| missingCount  | Current gap since last appearance     |
| avgMissing    | Average rounds between appearances    |
| openCount     | Frequency count in sample             |
| maxContinuous | Longest consecutive appearance streak |

---

## 6. Settle Bets (Webhook)

Settles all pending bets for a given round. Called by the game engine after each draw. Credits winnings to user wallets.

**Endpoint:** `POST /api/wingo/settle`

**Authentication:** `x-api-key` header

### Headers

| Header    | Value         | Required | Description    |
| --------- | ------------- | -------- | -------------- |
| x-api-key | admingm123456 | Yes      | API secret key |

### Request Body

| Field         | Type   | Required | Description          |
| ------------- | ------ | -------- | -------------------- |
| issueNumber   | string | Yes      | The round to settle  |
| result.number | number | Yes      | Winning number (0-9) |

### Request Example

```json
{
  "issueNumber": "202604280045",
  "result": { "number": 3 }
}
```

### Response Example

```json
{
  "status": "success",
  "msg": "Bets settled successfully",
  "settled": 5,
  "totalPayout": 490,
  "result": {
    "number": "3",
    "colour": "green",
    "timestamp": "2026-05-02 20:06:13"
  }
}
```

### Error Responses

**401 - Missing API key**

```json
{
  "status": "failed",
  "msg": "API key is required"
}
```

**403 - Invalid API key**

```json
{
  "status": "failed",
  "msg": "Invalid API key"
}
```

**400 - Missing fields**

```json
{
  "status": "failed",
  "msg": "issueNumber and result.number are required"
}
```

---

## Game Rules

### Round Cycle (30 seconds)

```
0s ─────────────── 25s ────────────── 30s
     Betting Open          Closed
     (place bets)      (draw happens)
```

### Winning Multipliers

| Bet Type     | Condition            | Multiplier | Example (Bet 100) |
| ------------ | -------------------- | ---------- | ----------------- |
| Number (0-9) | Exact match          | 9x         | Win 882           |
| Big          | Result 5, 6, 7, 8, 9 | 2x         | Win 196           |
| Small        | Result 0, 1, 2, 3, 4 | 2x         | Win 196           |
| Violet       | Result 0 or 5        | 4.5x       | Win 441           |
| Green        | Result 1, 3, 7, 9    | 2x         | Win 196           |
| Green        | Result 5             | 1.5x       | Win 147           |
| Red          | Result 2, 4, 6, 8    | 2x         | Win 196           |
| Red          | Result 0             | 1.5x       | Win 147           |

### Fee Deduction

Every bet incurs a **2% fee**:

```
realAmount = betAmount - (betAmount * 0.02)
```

### Number to Colour Mapping

| Number | Colour       |
| ------ | ------------ |
| 0      | red,violet   |
| 1      | green        |
| 2      | red          |
| 3      | green        |
| 4      | red          |
| 5      | green,violet |
| 6      | red          |
| 7      | green        |
| 8      | red          |
| 9      | green        |

### Bet Status Flow

```
pending → won  (if selection matches result)
pending → lost (if selection doesn't match)
```

- Bets start as `pending`, result is `null` until settlement
- Settlement happens automatically after each draw
- Winnings are credited directly to user wallet

---

## Environment Variables

```env
WINGO_API_KEY=admingm123456
WINGO_API_SECRET=1234567890
WINGO_MONGO_URI=mongodb+srv://bcsukh1234:bcsukh1234@wingoreal.gywuiow.mongodb.net/?appName=wingoreal
WINGO_REDIS_URL=redis://default:...@redis-19166.crce283.ap-south-1-2.ec2.cloud.redislabs.com:19166
WINGO_ADMIN_KEY=sdffasdgfsadfasf
```
