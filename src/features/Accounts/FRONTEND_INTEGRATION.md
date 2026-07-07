# Accounts Module — React Frontend Integration (v2 — corrected)

## What changed from the first pass

Two things I got wrong initially, now fixed:

1. **Folder**: you use `features/`, not `pages/`. All files below assume the
   same relative import depth as `AddMember.jsx` (`../../services/...`,
   `../../context/...`), so they drop straight into a sibling folder:
   `src/features/Accounts/`.
2. **`societyId` sourcing**: your app doesn't have a sync `GetSessionData("society_id")`
   helper. The real pattern (confirmed from `AddMember.jsx` and `Dashboard.jsx`)
   is: `const data = await GetSessionData(); const societyId = data.data.flats[0].society_id;`
   resolved once per feature, held in local state, and passed explicitly into
   every API call. **`AccountsApi.js` and all 6 screens now match this** —
   every exported API function takes `societyId` as its first argument, same
   as `getMembersApi(societyId, page, ...)` in `AddMemberApi.js`.

## Files

```
features/Accounts/
  Accounts.jsx           Entry point — resolves societyId via GetSessionData(),
                          renders the 6 tabs below, passing societyId as a prop
  AccountsUI.jsx          Shared Badge/Modal/Button/Input/Select primitives (Tailwind only)
  ChartOfAccounts.jsx
  JournalEntry.jsx
  BankAccounts.jsx
  AccountsReports.jsx
  BudgetManager.jsx
  PeriodLock.jsx
services/AccountsApi.js
```

## 1. Copy files

```bash
cp frontend/Accounts*.jsx frontend/ChartOfAccounts.jsx frontend/JournalEntry.jsx \
   frontend/BankAccounts.jsx frontend/BudgetManager.jsx frontend/PeriodLock.jsx \
   <project>/src/features/Accounts/
cp frontend/AccountsApi.js <project>/src/services/AccountsApi.js
```

## 2. Wire into Dashboard.jsx (not Routes.jsx)

Your actual navigation is a single-page tab-switcher inside `Dashboard.jsx` —
`NAV` (sidebar sections), `TITLES` (breadcrumbs), and a `PAGES` lookup object
rendered as `{PAGES[active] ?? <PlaceholderPage .../>}`. `billing` is already
wired there (`billing: <Billing setActive={setActive} />`); add `accounts`
the same way.

**Import**, near your other feature imports:
```jsx
import Accounts from "../Accounts/Accounts";
```

**`NAV`** — add an item, e.g. under `"Operations"` next to `billing`:
```js
{ id: "accounts", icon: "📒", lbl: "Accounts" },
```

**`TITLES`** — add:
```js
accounts: ["Operations", "Accounts"],
```

**`PAGES`** — add, matching the `billing` entry's shape:
```js
accounts: <Accounts setActive={setActive} />,
```

That's it — no `Routes.jsx` change needed, since `Dashboard.jsx` doesn't use
route-based navigation for these feature panels.

## 3. Confirm these utilities match your real ones

| Import | Expected shape (confirmed from your files) |
|---|---|
| `../utils/apiClient` (default export) | axios instance: `apiClient({method, url, data})` |
| `../utils/ErrorHandler` (default export) | `ErrorHandler(error) → normalized error` |
| `../utils/Url` (default export `UrlData`) | base API URL string |
| `../../utils/SessionManagement` → `GetSessionData` | **async, no args** — returns `{ data: { flats: [...], first_name, last_name, profile_url, ... } }`. `Accounts.jsx` reads `data.data.flats[0].society_id`, exactly like `AddMember.jsx` line 86–88. |
| `../../context/LoaderContext` → `useLoader` | returns `{ showLoader, hideLoader }` |

## 4. Endpoint mapping

`AccountsApi.js` calls `UrlData + "accounts/" + EndpointName`, matching
`register_route(accounts_bp, "/EndpointName", ...)` in `accounts_routes.py`.
If your blueprint's `url_prefix` isn't `/accounts`, update the `MODULE`
constant at the top of `AccountsApi.js`.

## 5. First-run checklist (per society)

1. **Chart of Accounts** tab → **Seed defaults** button (shown when the list
   is empty) → creates the 15 default heads.
2. The amber banner lists billing charge heads not yet mapped to an income
   account — click each to map it (needed before bills auto-post journals).
3. From then on, new bills/receipts/penalties/interest/waiveoffs post
   automatically (see the backend package's `DEPLOYMENT.md`).

## Known gaps / next steps

- **Ledger drill-down**: `getAccountHeadLedgerApi` exists but no screen calls
  it yet — add a "View ledger" link per Chart of Accounts row if wanted.
- **Export**: `AccountsReports.jsx` wires `exportFile` (your existing
  `components/Common/ExportFile`) for Trial Balance only — verify the row
  shape it expects. Balance Sheet/I&E render as sectioned cards, not
  exportable tables yet.
- **Manual per-flat journal lines**: `addJournalLineApi` accepts `flat_id`
  but `JournalEntry.jsx`'s line-add form has no UI input for it (not needed
  for auto-posted bill/receipt/penalty/interest entries — those are already
  wired server-side with the correct `flat_id`). Add an `Input` there only if
  you want manual per-flat journal entries from the UI.
