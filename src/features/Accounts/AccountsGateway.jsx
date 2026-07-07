import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  FiFileText, FiBookOpen, FiCalendar, FiDollarSign, FiPieChart,
  FiTarget, FiRefreshCw, FiLock, FiAlertTriangle, FiSettings,
} from "react-icons/fi";
import { T, FKeyBar, errMsg } from "./AccountsUI";
import { getAccountsSyncStatusApi, fixAllSyncIssuesApi } from "../../services/AccountsApi";

const MENU = [
  { key: "vouchers", label: "Accounting Vouchers", hint: "Contra / Payment / Receipt / Journal", icon: FiFileText, fkey: "F4-F7" },
  { key: "ledgers", label: "Chart of Accounts", hint: "Groups & Ledgers", icon: FiBookOpen },
  { key: "roles", label: "System Roles", hint: "Bank / Cash / Receivable setup", icon: FiSettings },
  { key: "daybook", label: "Day Book", hint: "All vouchers, chronological", icon: FiCalendar },
  { key: "collection", label: "Collection Register", hint: "Bills raised & receipts collected", icon: FiDollarSign },
  { key: "cashbank", label: "Cash / Bank Book", hint: "Ledger-wise running balance", icon: FiDollarSign },
  { key: "reports", label: "Financial Reports", hint: "Trial Balance / Balance Sheet / I&E", icon: FiPieChart },
  { key: "budget", label: "Budgets", hint: "Annual budget vs actual", icon: FiTarget },
  { key: "bank", label: "Bank Reconciliation", hint: "Match statement vs books", icon: FiRefreshCw },
  { key: "periods", label: "Period Lock", hint: "Close months for audit", icon: FiLock },
];

const MenuCard = ({ item, onNavigate }) => {
  const [hover, setHover] = useState(false);
  const Icon = item.icon;
  return (
    <button
      onClick={() => onNavigate(item.key)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: T.colors.white,
        border: `1px solid ${hover ? T.colors.blue400 : T.colors.border}`,
        borderRadius: 12,
        padding: 20,
        textAlign: "left",
        cursor: "pointer",
        boxShadow: hover ? "0 4px 10px rgba(37,99,235,0.12)" : "0 1px 2px rgba(0,0,0,0.03)",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          backgroundColor: hover ? T.colors.blue100 : T.colors.blue50,
          display: "flex", alignItems: "center", justifyContent: "center", color: T.colors.blue600,
        }}>
          <Icon size={18} />
        </div>
        {item.fkey && (
          <span style={{ fontSize: 10, fontWeight: 600, color: T.colors.blue500, backgroundColor: T.colors.blue50, padding: "2px 6px", borderRadius: 4 }}>
            {item.fkey}
          </span>
        )}
      </div>
      <div style={T.cardTitle}>{item.label}</div>
      <div style={T.cardHint}>{item.hint}</div>
    </button>
  );
};

const AccountsGateway = ({ societyId, societyName, onNavigate, onExit }) => {
  const [status, setStatus] = useState(null);
  const [fixing, setFixing] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!societyId) return;
    try {
      const res = await getAccountsSyncStatusApi(societyId);
      setStatus(res);
    } catch (e) { /* non-blocking — banner just won't show */ }
  }, [societyId]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleFixAll = async () => {
    setFixing(true);
    try {
      const res = await fixAllSyncIssuesApi(societyId);
      toast.success(
        `Synced ${res.ledgers_synced} ledgers · journaled ${res.bills_journaled} bills · ${res.receipts_journaled} receipts`
      );
      if ((res.ledger_sync_failed || 0) + (res.bills_failed || 0) + (res.receipts_failed || 0) > 0) {
        toast.error("Some items were skipped — check Chart of Accounts and Collection Register for details");
      }
      fetchStatus();
    } catch (e) {
      toast.error(errMsg(e, "Fix failed"));
    } finally {
      setFixing(false);
    }
  };

  const totalIssues = status
    ? (status.unmapped_charge_heads || 0) + (status.bills_not_journaled || 0) + (status.receipts_not_journaled || 0) + (status.missing_required_roles || 0) + (status.wallet_txns_not_journaled || 0)
    : 0;
  const notSetUp = status && (status.groups_seeded === 0 || status.default_ledgers_seeded === 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: T.colors.bg }}>
      <div style={{ backgroundColor: T.colors.white, borderBottom: `1px solid ${T.colors.border}`, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: T.colors.slate800 }}>{societyName || "Society"} Accounts</div>
        <div style={{ color: T.colors.blue600, fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>
          Gateway of Accounts
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, paddingBottom: 80 }}>
        {notSetUp && (
          <div style={{
            backgroundColor: "#eff6ff", border: `1px solid ${T.colors.blue100}`, borderRadius: 12,
            padding: 16, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <FiBookOpen size={22} color={T.colors.blue600} />
              <div>
                <div style={{ fontWeight: 600, color: T.colors.blue700, fontSize: 14 }}>Accounts isn't set up yet</div>
                <div style={{ fontSize: 12, color: T.colors.slate500 }}>Create the standard Chart of Accounts to get started.</div>
              </div>
            </div>
            <button onClick={() => onNavigate("ledgers")} style={{
              backgroundColor: T.colors.blue600, color: T.colors.white, border: "none", borderRadius: 8,
              padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", flexShrink: 0,
            }}>Set Up Now</button>
          </div>
        )}

        {!notSetUp && totalIssues > 0 && (
          <div style={{
            backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12,
            padding: 16, marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FiAlertTriangle size={22} color="#d97706" />
                <div>
                  <div style={{ fontWeight: 600, color: "#92400e", fontSize: 14 }}>
                    Accounts is out of sync with Billing
                  </div>
                  <div style={{ fontSize: 12, color: "#92400e", marginTop: 2 }}>
                    {status.missing_required_roles > 0 && <span>{status.missing_required_roles} required ledger role(s) not assigned · </span>}
                    {status.unmapped_charge_heads > 0 && <span>{status.unmapped_charge_heads} charge head(s) need a ledger · </span>}
                    {status.bills_not_journaled > 0 && <span>{status.bills_not_journaled} bill(s) not journaled · </span>}
                    {status.receipts_not_journaled > 0 && <span>{status.receipts_not_journaled} receipt(s) not journaled · </span>}
                    {status.wallet_txns_not_journaled > 0 && <span>{status.wallet_txns_not_journaled} wallet transaction(s) not journaled</span>}
                  </div>
                </div>
              </div>
              {status.missing_required_roles > 0 ? (
                <button onClick={() => onNavigate("roles")} style={{
                  backgroundColor: "#d97706", color: T.colors.white, border: "none", borderRadius: 8,
                  padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", flexShrink: 0,
                }}>Set Up Roles First</button>
              ) : (
                <button onClick={handleFixAll} disabled={fixing} style={{
                  backgroundColor: fixing ? "#fcd34d" : "#d97706", color: T.colors.white, border: "none", borderRadius: 8,
                  padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: fixing ? "not-allowed" : "pointer", flexShrink: 0,
                }}>{fixing ? "Fixing…" : "Fix All Now"}</button>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {MENU.map((item) => (
            <MenuCard key={item.key} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      <FKeyBar items={[]} onEscape={onExit} />
    </div>
  );
};

export default AccountsGateway;
