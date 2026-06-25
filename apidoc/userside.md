# Wingo Game API - User Side

## Base URL

```
http://localhost:3000/api/wingo
```

## Game Modes

All endpoints support the following game modes via `?mode=` query parameter (defaults to `30s`):

| Mode | Duration | Game Code | Periods/Day | Issue Example |
|------|----------|-----------|-------------|---------------|
| `30s` | 30 sec | `WinGo_30S` | 2880 | `202605100000001` |
| `1m` | 1 min | `WinGo_1M` | 1440 | `1M_20260510000001` |
| `3m` | 3 min | `WinGo_3M` | 480 | `3M_20260510000001` |
| `5m` | 5 min | `WinGo_5M` | 288 | `5M_20260510000001` |

---

## Authentication

Betting endpoints require Bearer token:

```
Authorization: Bearer <user_token>
```

---

## Get Current Round

```
GET /api/wingo/current?mode=30s
```

Returns current active round with previous/next timings. Frontend uses this for countdown.

**Authentication:** None

**Query Params:** `mode` (optional, default: `30s`)

**Response:**

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

| Field | Description |
|-------|-------------|
| `gameCode` | Mode-specific: `WinGo_30S`, `WinGo_1M`, `WinGo_3M`, `WinGo_5M` |
| `intervalMinute` | Round duration (0.5=30s, 1=1m, 3=3m, 5=5m) |
| `state` | 1 = running |
| `current.issueNumber` | Use this for placing bets |
| `current.endTime` | Betting closes at this timestamp |

**1m example:** `GET /api/wingo/current?mode=1m`

---

## Place Bet

```
POST /api/wingo/bet
```

**Headers:** `Authorization: Bearer <user_token>`

**Body:**

```json
{
  "issueNumber": "202605100000002",
  "betamount": 100,
  "selectType": "green",
  "mode": "30s"
}
```

| Param | Type | Required | Description |
|-------|------|---------|-------------|
| issueNumber | string | Yes | Current round issue number |
| betamount | number | Yes | Bet amount |
| selectType | string | Yes | `red`, `green`, `violet`, `big`, `small`, or `0`-`9` |
| mode | string | No | Game mode (`30s`, `1m`, `3m`, `5m`). Defaults to `30s`. |

**Select Types:**

| Type | Description | Example Win |
|------|-------------|-------------|
| `red` / `green` / `violet` | Color bet | Result color matches |
| `big` (5-9) / `small` (0-4) | Size bet | Result number matches size |
| `0`-`9` | Exact number | Result number matches exactly |

**Response:**

```json
{
  "status": "success"
}
```

**1m example:**
```json
{
  "issueNumber": "1M_20260510000001",
  "betamount": 100,
  "selectType": "green",
  "mode": "1m"
}
```

---

## Get My Bets

```
GET /api/wingo/bets?page=1&limit=25&status=won&issueNumber=202605100000002
```

**Authentication:** Bearer token required

**Response:**

```json
{
  "status": "success",
  "total": 50,
  "page": 1,
  "limit": 25,
  "items": [
    {
      "issueNumber": "202605100000002",
      "orderNumber": "WDGT202605100000002123456",
      "betamount": 100,
      "fee": 2,
      "selectType": "green",
      "result": {
        "number": "5",
        "profitAmount": 90
      },
      "realAmount": 98,
      "status": "won",
      "timestamp": "2026-05-10 10:00:00"
    }
  ]
}
```

---

## Check If I Won

```
GET /api/wingo/iswin?issue=202605100000002
```

**Authentication:** Bearer token required

**Description:** Check if you won a specific round and see your profit amount.

**Response:**

```json
{
  "status": "success",
  "issue": "202605100000002",
  "result": 5,
  "winamt": [90]
}
```

| Field | Description |
|-------|-------------|
| `result` | The winning number (0-9) |
| `winamt` | Array of profit amounts won (one per bet) |

---

## Withdrawal Flow (Winnings)

Wingo winnings are **automatically credited** to your main wallet when the round is settled. No separate withdrawal action is needed.

1. **Round ends** → Result is declared
2. **System settles** → Winning bets are calculated
3. **Auto-credit** → Winning amount added to wallet balance
4. **Ledger recorded** → Transaction with type `WIN` is created

To withdraw your Wingo winnings, use the standard withdrawal flow:

```
POST /account/withdraw
```

---

## Get Draw History

```
GET /api/wingo/history?pageNo=1&mode=30s
```

Returns paginated past round results for the specified game mode.

**Query Params:** `pageNo` (default: 1), `mode` (default: `30s`)

**Response:**

```json
{
  "data": {
    "list": [
      { "issueNumber": "202605100000001", "number": 5 }
    ],
    "pageNo": 1,
    "totalPage": 288,
    "totalCount": 2880
  },
  "code": 0,
  "msg": "Succeed",
  "msgCode": 0,
  "serviceTime": 1712345678901
}
```

---

## Get Trends

```
GET /api/wingo/trends?mode=30s
```

Returns hot/cold statistics for numbers 0-9 for the specified game mode.

**Query Params:** `mode` (optional, default: `30s`)
