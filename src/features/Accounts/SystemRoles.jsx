import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiSettings, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { getSystemRoleStatusApi, setLedgerRoleApi, listAccountHeadsApi } from "../../services/AccountsApi";
import { T, Select, FKeyBar, errMsg } from "./AccountsUI";

const ROLE_INFO = {
  bank:                  { label: "Bank Account",         hint: "Used when a receipt is collected by bank/cheque/UPI/NEFT",   headType: "asset" },
  cash:                  { label: "Cash in Hand",          hint: "Used when a receipt is collected in cash",                    headType: "asset" },
  accounts_receivable:   { label: "Accounts Receivable",   hint: "Tracks what members owe — every bill and receipt posts here", headType: "asset" },
  gst_payable:           { label: "GST Payable",           hint: "Optional — only needed if GST is applicable on bills",        headType: "liability" },
  penalty_income:        { label: "Penalty / Interest Income", hint: "Used when late fees or interest are charged",             headType: "income" },
  waiveoff_expense:      { label: "Waiveoff / Bad Debt Expense", hint: "Used when a bill's dues are waived off",                headType: "expenditure" },
  wallet_liability:      { label: "Wallet Liability",           hint: "Tracks member wallet credit balances as a liability",   headType: "liability" },
};

const SystemRoles = ({ societyId, onEscape }) => {
  const [roles, setRoles] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSystemRoleStatusApi(societyId);
      setRoles(res?.roles || []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load role status"));
    } finally {
      setLoading(false);
    }
  }, [societyId]);

  const fetchCandidates = useCallback(async () => {
    const types = ["asset", "liability", "income", "expenditure"];
    const next = {};
    for (const t of types) {
      try {
        const res = await listAccountHeadsApi(societyId, null, t);
        next[t] = res?.heads || [];
      } catch (e) { next[t] = []; }
    }
    setCandidates(next);
  }, [societyId]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);
  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const handleAssign = async (role, headId) => {
    if (!headId) return;
    setSaving(role);
    try {
      await setLedgerRoleApi(societyId, headId, role);
      toast.success(`${ROLE_INFO[role].label} assigned`);
      fetchStatus();
    } catch (e) {
      toast.error(errMsg(e, "Failed to assign role"));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiSettings size={16} /> System Roles</h1>
      </div>

      <div style={{ padding: 16, paddingBottom: 64, maxWidth: 720 }}>
        <p style={{ fontSize: 13, color: T.colors.slate500, marginBottom: 20 }}>
          These roles tell the billing auto-journal which of your existing ledgers to use —
          it works with whatever Chart of Accounts you already have, whatever the naming.
          Bank, Cash, and Accounts Receivable are required for bills/receipts to post automatically;
          the rest are optional but recommended.
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</div>
        ) : (
          <div style={{ ...T.panel }}>
            {roles.map((r, idx) => {
              const info = ROLE_INFO[r.role] || {};
              const options = (candidates[info.headType] || []).map((h) => ({ value: h.id, label: `${h.head_code} — ${h.head_name}` }));
              return (
                <div key={r.role} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  padding: 16, borderBottom: idx < roles.length - 1 ? `1px solid ${T.colors.borderLight}` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    {r.head_id ? (
                      <FiCheckCircle size={20} color={T.colors.green700} style={{ flexShrink: 0 }} />
                    ) : (
                      <FiAlertCircle size={20} color="#d97706" style={{ flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: T.colors.slate800, fontSize: 13 }}>{info.label || r.role}</div>
                      <div style={{ fontSize: 11, color: T.colors.slate400 }}>{info.hint}</div>
                      {r.head_id && (
                        <div style={{ fontSize: 11, color: T.colors.green700, marginTop: 2 }}>
                          Currently: {r.head_code} — {r.head_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ width: 260, flexShrink: 0 }}>
                    <Select
                      value={r.head_id || ""}
                      onChange={(e) => handleAssign(r.role, e.target.value)}
                      options={options}
                      placeholder={saving === r.role ? "Saving…" : "Choose ledger…"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default SystemRoles;
