import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { useLoader } from "../../context/LoaderContext";
import {
  upsertBankAccountApi, listBankAccountsApi, listAccountHeadsApi,
  startBankReconciliationApi, matchReconciliationItemApi,
  completeBankReconciliationApi, getBankReconciliationApi,
} from "../../services/AccountsApi";
import { T, Badge, Modal, EmptyState, Button, Input, Select, money, fmtDate, FKeyBar } from "./AccountsUI";

const BankAccounts = ({ societyId, onEscape }) => {
  const { showLoader, hideLoader } = useLoader();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assetHeads, setAssetHeads] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});

  const [reconModalOpen, setReconModalOpen] = useState(false);
  const [reconAccount, setReconAccount] = useState(null);
  const [reconForm, setReconForm] = useState({ statement_date: new Date().toISOString().slice(0, 10), statement_closing_balance: "" });

  const [reconDetailOpen, setReconDetailOpen] = useState(false);
  const [activeRecon, setActiveRecon] = useState(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listBankAccountsApi(societyId);
      setAccounts(res?.accounts || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load bank accounts");
    } finally {
      setLoading(false);
    }
  }, [societyId]);

  const fetchAssetHeads = useCallback(async () => {
    try {
      const res = await listAccountHeadsApi(societyId);
      const eligible = (res?.heads || []).filter((h) => h.group_name === "Bank Accounts" || h.group_name === "Cash-in-hand");
      setAssetHeads(eligible);
    } catch (e) { /* non-blocking */ }
  }, [societyId]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);
  useEffect(() => { fetchAssetHeads(); }, [fetchAssetHeads]);

  const openCreate = () => {
    setForm({ account_name: "", account_type: "bank", bank_name: "", branch: "", account_number: "",
      ifsc_code: "", opening_balance: "0", opening_balance_date: "", coa_head_id: "", is_active: 1 });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.account_name || !form.coa_head_id) {
      toast.error("Account name and linked ledger head are required");
      return;
    }
    showLoader?.();
    try {
      await upsertBankAccountApi(societyId, form);
      toast.success("Bank/cash account saved");
      setModalOpen(false);
      fetchAccounts();
    } catch (e2) {
      toast.error(e2?.message || "Failed to save bank account");
    } finally {
      hideLoader?.();
    }
  };

  const openReconciliation = (account) => {
    setReconAccount(account);
    setReconForm({ statement_date: new Date().toISOString().slice(0, 10), statement_closing_balance: "" });
    setReconModalOpen(true);
  };

  const handleStartRecon = async (e) => {
    e.preventDefault();
    if (!reconForm.statement_closing_balance) {
      toast.error("Statement closing balance is required");
      return;
    }
    showLoader?.();
    try {
      const recon = await startBankReconciliationApi(societyId, { ...reconForm, bank_account_id: reconAccount.id });
      toast.success("Reconciliation started");
      setReconModalOpen(false);
      openReconDetail(recon.id);
    } catch (e2) {
      toast.error(e2?.message || "Failed to start reconciliation");
    } finally {
      hideLoader?.();
    }
  };

  const openReconDetail = async (reconciliationId) => {
    showLoader?.();
    try {
      const res = await getBankReconciliationApi(societyId, reconciliationId);
      setActiveRecon(res);
      setReconDetailOpen(true);
    } catch (e) {
      toast.error(e?.message || "Failed to load reconciliation");
    } finally {
      hideLoader?.();
    }
  };

  const toggleMatch = async (item) => {
    try {
      await matchReconciliationItemApi(societyId, activeRecon.id, item.entry_id, !item.is_matched);
      const refreshed = await getBankReconciliationApi(societyId, activeRecon.id);
      setActiveRecon(refreshed);
    } catch (e) {
      toast.error(e?.message || "Failed to update match status");
    }
  };

  const handleComplete = async () => {
    if (!window.confirm("Mark this reconciliation as complete?")) return;
    try {
      await completeBankReconciliationApi(societyId, activeRecon.id);
      toast.success("Reconciliation completed");
      setReconDetailOpen(false);
      fetchAccounts();
    } catch (e) {
      toast.error(e?.message || "Failed to complete reconciliation");
    }
  };

  const matchedCount = (activeRecon?.items || []).filter((i) => i.is_matched).length;

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiRefreshCw size={16} /> Bank &amp; Cash Accounts</h1>
        <Button onClick={openCreate}><FiPlus size={13} /> New account</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, padding: 16, paddingBottom: 64 }}>
        {loading ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 32, color: T.colors.slate400 }}>Loading…</div>
        ) : accounts.length === 0 ? (
          <div style={{ gridColumn: "1 / -1" }}><EmptyState message="No bank or cash accounts yet" /></div>
        ) : (
          accounts.map((a) => (
            <div key={a.id} style={{ ...T.panel, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 500, color: T.colors.slate800 }}>{a.account_name}</div>
                  <div style={{ fontSize: 11, color: T.colors.slate400 }}>{a.account_type === "bank" ? a.bank_name : "Cash"}</div>
                </div>
                <Badge tone={a.account_type === "bank" ? "blue" : "green"}>{a.account_type}</Badge>
              </div>
              {a.account_number && <div style={{ fontSize: 11, color: T.colors.slate400, marginBottom: 8 }}>A/C: {a.account_number}</div>}
              <div style={{ fontSize: 18, fontWeight: 600, color: T.colors.slate800, marginBottom: 12 }}>{money(a.current_balance)}</div>
              {a.account_type === "bank" && (
                <Button variant="secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => openReconciliation(a)}>
                  <FiRefreshCw size={13} /> Reconcile
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Bank / Cash Account">
        <form onSubmit={handleSave}>
          <Input label="Account name" value={form.account_name || ""} onChange={(e) => setForm({ ...form, account_name: e.target.value })} required />
          <Select label="Type" value={form.account_type || "bank"} onChange={(e) => setForm({ ...form, account_type: e.target.value })}
            options={[{ value: "bank", label: "Bank" }, { value: "cash", label: "Cash" }]} />
          <Select label="Linked ledger head" value={form.coa_head_id || ""} onChange={(e) => setForm({ ...form, coa_head_id: e.target.value })}
            options={assetHeads.map((h) => ({ value: h.id, label: `${h.head_code} — ${h.head_name}` }))} required />
          {form.account_type === "bank" && (
            <>
              <Input label="Bank name" value={form.bank_name || ""} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Branch" value={form.branch || ""} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
                <Input label="IFSC" value={form.ifsc_code || ""} onChange={(e) => setForm({ ...form, ifsc_code: e.target.value.toUpperCase() })} />
              </div>
              <Input label="Account number" value={form.account_number || ""} onChange={(e) => setForm({ ...form, account_number: e.target.value })} />
            </>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Opening balance" type="number" step="0.01" value={form.opening_balance ?? 0} onChange={(e) => setForm({ ...form, opening_balance: e.target.value })} />
            <Input label="As of date" type="date" value={form.opening_balance_date || ""} onChange={(e) => setForm({ ...form, opening_balance_date: e.target.value })} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.colors.border}` }}>
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save account</Button>
          </div>
        </form>
      </Modal>

      <Modal open={reconModalOpen} onClose={() => setReconModalOpen(false)} title={`Reconcile — ${reconAccount?.account_name || ""}`}>
        <form onSubmit={handleStartRecon}>
          <Input label="Statement date" type="date" value={reconForm.statement_date}
            onChange={(e) => setReconForm({ ...reconForm, statement_date: e.target.value })} required />
          <Input label="Statement closing balance" type="number" step="0.01" value={reconForm.statement_closing_balance}
            onChange={(e) => setReconForm({ ...reconForm, statement_closing_balance: e.target.value })} required />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.colors.border}` }}>
            <Button variant="secondary" type="button" onClick={() => setReconModalOpen(false)}>Cancel</Button>
            <Button type="submit">Start reconciliation</Button>
          </div>
        </form>
      </Modal>

      <Modal open={reconDetailOpen} onClose={() => setReconDetailOpen(false)} title="Bank Reconciliation" width={640}>
        {activeRecon && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16, fontSize: 13 }}>
              <div style={{ backgroundColor: T.colors.bg, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.colors.slate400, marginBottom: 2 }}>Statement balance</div>
                <div style={{ fontWeight: 600 }}>{money(activeRecon.statement_closing_balance)}</div>
              </div>
              <div style={{ backgroundColor: T.colors.bg, borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.colors.slate400, marginBottom: 2 }}>Book balance</div>
                <div style={{ fontWeight: 600 }}>{money(activeRecon.book_closing_balance)}</div>
              </div>
              <div style={{ backgroundColor: Number(activeRecon.difference) === 0 ? "#ecfdf5" : "#fffbeb", borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: T.colors.slate400, marginBottom: 2 }}>Difference</div>
                <div style={{ fontWeight: 600 }}>{money(activeRecon.difference)}</div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: T.colors.slate500, marginBottom: 8 }}>{matchedCount} of {(activeRecon.items || []).length} entries matched</div>

            <div style={{ maxHeight: 320, overflowY: "auto", border: `1px solid ${T.colors.border}`, borderRadius: 8 }}>
              {(activeRecon.items || []).length === 0 ? (
                <EmptyState message="No entries to reconcile" />
              ) : (
                activeRecon.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", fontSize: 13, borderBottom: `1px solid ${T.colors.borderLight}` }}>
                    <div>
                      <div style={{ color: T.colors.slate700 }}>{item.narration || item.journal_no}</div>
                      <div style={{ fontSize: 11, color: T.colors.slate400 }}>{fmtDate(item.entry_date)} · {item.entry_type}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 500 }}>{money(item.amount)}</span>
                      <button onClick={() => toggleMatch(item)} title={item.is_matched ? "Unmatch" : "Mark matched"} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <FiCheckCircle size={18} color={item.is_matched ? T.colors.green700 : "#cbd5e1"} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 16, marginTop: 8, borderTop: `1px solid ${T.colors.border}` }}>
              <Button variant="secondary" onClick={() => setReconDetailOpen(false)}>Close</Button>
              {activeRecon.status !== "completed" && <Button onClick={handleComplete}>Mark completed</Button>}
            </div>
          </div>
        )}
      </Modal>

      <FKeyBar items={[]} onEscape={onEscape} />
    </div>
  );
};

export default BankAccounts;
