# VIP API - User Side

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

## Get VIP Status

```
GET /account/vip
```

**Response:**

```json
{
  "status": "success",
  "vipLevel": "VIP 3",
  "vipSince": "2026-06-04T16:12:08.889Z",
  "totalDeposits": 1000,
  "weeklyStatus": "eligible",
  "upgradeStatus": "unclaimed",
  "vipLevels": {
    "VIP 1": { "minDeposit": 0, "weeklyBonus": 0, "upgradeBonus": 0, "weeklyDepositRequirement": 0 },
    "VIP 2": { "minDeposit": 100, "weeklyBonus": 0, "upgradeBonus": 0, "weeklyDepositRequirement": 0 },
    "VIP 3": { "minDeposit": 2000, "weeklyBonus": 21, "upgradeBonus": 15, "weeklyDepositRequirement": 200 },
    "VIP 4": { "minDeposit": 5000, "weeklyBonus": 41, "upgradeBonus": 31, "weeklyDepositRequirement": 300 },
    "VIP 5": { "minDeposit": 25000, "weeklyBonus": 151, "upgradeBonus": 90, "weeklyDepositRequirement": 400 },
    "VIP 6": { "minDeposit": 100000, "weeklyBonus": 551, "upgradeBonus": 900, "weeklyDepositRequirement": 1000 }
  }
}
```

### Status Fields

| Field | Values | Description |
|-------|--------|-------------|
| `weeklyStatus` | `"eligible"`, `"claimed"`, `"deposit_not_met"` | Weekly bonus claim status |
| `upgradeStatus` | `"claimed"`, `"unclaimed"` | Upgrade bonus claim status |

---

## Claim Weekly Bonus

```
POST /account/vip/weekly-bonus
```

**Description:** Claims the weekly bonus for the user's current VIP level. Requires meeting the weekly deposit requirement for that tier. Can only be claimed once per week (Monday–Sunday).

**Response:**

```json
{
  "status": "success",
  "userId": 123456,
  "weeklyBonus": 21,
  "balanceAfter": 1150.0,
  "vipLevel": "VIP 3"
}
```

**Note:** Claiming the weekly bonus adds a turnover requirement. The bonus amount needs to be turned over before withdrawal.

---

## Claim Upgrade Bonus

```
POST /account/vip/upgrade-bonus
```

**Description:** Claims the accumulated upgrade bonus earned from VIP level ups. Each time you reach a new VIP tier, the upgrade bonus is added to pending balance. Claim it here separately.

**Response:**

```json
{
  "status": "success",
  "userId": 123456,
  "upgradeBonus": 15,
  "balanceAfter": 1171.0,
  "vipLevel": "VIP 3"
}
```

**Note:** Claiming the upgrade bonus adds a turnover requirement. The bonus amount needs to be turned over before withdrawal.

---

## VIP Tier Requirements

| Tier | Cumulative Deposit | Weekly Bonus | Upgrade Bonus | Weekly Deposit Requirement |
|------|------------------|-------------|--------------|--------------------------|
| VIP 1 | 0 | 0 | 0 | 0 |
| VIP 2 | 100 | 0 | 0 | 0 |
| VIP 3 | 2,000 | 21 | 15 | 200 |
| VIP 4 | 5,000 | 41 | 31 | 300 |
| VIP 5 | 25,000 | 151 | 90 | 400 |
| VIP 6 | 100,000 | 551 | 900 | 1,000 |
