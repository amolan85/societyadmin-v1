import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiTarget, FiPlus, FiAlertTriangle } from "react-icons/fi";
import { upsertBudgetApi, autoSplitBudgetMonthlyApi, getBudgetVsActualApi, listAccountHeadsApi } from "../../services/AccountsApi";
import { T, Modal, EmptyState, Button, Input, Select, money, FKeyBar, errMsg } from "./AccountsUI";

const currentFY = () => {
  const d = new Date();
  const y = d.getMonth() + 1 >= 4 ? d.getFullYear() : d.getFullYear() - 1;
  return `FY${y}-${String(y + 1).slice(2)}`;
};

const BudgetManager = ({ societyId, onEscape }) => {
  const [fy, setFy] = useState(currentFY());
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ head_id: "", financial_year: fy, annual_amount: "", alert_threshold_pct: "90" });

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBudgetVsActualApi(societyId, fy);
      setBudgets(res?.budgets || []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load budgets"));
    } finally {
      setLoading(false);
    }
  }, [societyId, fy]);

  const fetchExpenseHeads = useCallback(async () => {
    try {
      const res = await listAccountHeadsApi(societyId, null, "expenditure");
      // Waiveoff/Bad Debt Expense is an Accounting/Audit action (dues
      // written off by committee resolution), not a routine budgetable
      // expense like Electricity or Salary — exclude it from this picker.
      setExpenseHeads((res?.heads || []).filter((h) => h.system_role !== "waiveoff_expense"));
    } catch (e) { /* non-blocking */ }
  }, [societyId]);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);
  useEffect(() => { fetchExpenseHeads(); }, [fetchExpenseHeads]);

  const openCreate = () => {
    setForm({ head_id: "", financial_year: fy, annual_amount: "", alert_threshold_pct: "90" });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.head_id || !form.annual_amount) {
      toast.error("Account head and annual amount are required");
      return;
    }
    try {
      const budget = await upsertBudgetApi(societyId, form);
      const startYear = Number(form.financial_year.match(/\d{4}/)?.[0] || new Date().getFullYear());
      await autoSplitBudgetMonthlyApi(societyId, budget.id, startYear, 4);
      toast.success("Budget created and split into monthly allocations");
      setModalOpen(false);
      fetchBudgets();
    } catch (e2) {
      toast.error(errMsg(e2, "Failed to save budget"));
    }
  };

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiTarget size={16} /> Budgets</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <Input label="" style={{ width: 140 }} placeholder="FY2026-27" value={fy} onChange={(e) => setFy(e.target.value)} />
          <Button onClick={openCreate}><FiPlus size={13} /> New budget</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, paddingBottom: 64 }}>
        {loading ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</div>
        ) : budgets.length === 0 ? (
          <div style={{ gridColumn: "1 / -1" }}><EmptyState message={`No budgets set for ${fy}`} /></div>
        ) : (
          budgets.map((b) => (
            <div key={b.budget_id} style={{ ...T.panel, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 500, color: T.colors.slate800 }}>{b.head_name}</div>
                  <div style={{ fontSize: 11, color: T.colors.slate400, fontFamily: "monospace" }}>{b.head_code}</div>
                </div>
                {b.is_alert === 1 && (
                  <span title={`Over ${b.alert_threshold_pct}% of budget used`}>
                    <FiAlertTriangle color="#f59e0b" size={18} />
                  </span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: T.colors.slate500 }}>Spent</span>
                <span style={{ fontWeight: 500 }}>{money(b.actual_spent)} / {money(b.annual_amount)}</span>
              </div>
              <div style={{ width: "100%", height: 8, backgroundColor: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", borderRadius: 999, width: `${Math.min(Number(b.pct_used || 0), 100)}%`, backgroundColor: b.pct_used >= b.alert_threshold_pct ? "#f59e0b" : T.colors.blue600 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.colors.slate400 }}>
                <span>{b.pct_used}% used</span>
                <span>Variance: {money(b.variance)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Budget">
        <form onSubmit={handleSave}>
          <Select label="Expense account" value={form.head_id} onChange={(e) => setForm({ ...form, head_id: e.target.value })}
            options={expenseHeads.map((h) => ({ value: h.id, label: `${h.head_code} — ${h.head_name}` }))} required />
          <Input label="Financial year" value={form.financial_year} onChange={(e) => setForm({ ...form, financial_year: e.target.value })} placeholder="FY2026-27" required />
          <Input label="Annual amount" type="number" step="0.01" value={form.annual_amount} onChange={(e) => setForm({ ...form, annual_amount: e.target.value })} required />
          <Input label="Alert threshold %" type="number" step="1" value={form.alert_threshold_pct} onChange={(e) => setForm({ ...form, alert_threshold_pct: e.target.value })} />
          <p style={{ fontSize: 11, color: T.colors.slate400, marginBottom: 12 }}>Automatically split evenly across 12 months from April.</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.colors.border}` }}>
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create budget</Button>
          </div>
        </form>
      </Modal>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default BudgetManager;
