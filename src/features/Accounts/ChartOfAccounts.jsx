import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiLink, FiRefreshCw } from "react-icons/fi";
import { useLoader } from "../../context/LoaderContext";
import {
  seedChartOfAccountsApi,
  upsertAccountHeadApi,
  listAccountHeadsApi,
  deleteAccountHeadApi,
  listUnmappedChargeHeadsApi,
  setChargeHeadAccountMappingApi,
} from "../../services/AccountsApi";
import { Badge, Modal, EmptyState, LoadingRow, Button, Input, Select, money } from "./AccountsUI";

const HEAD_TYPES = ["asset", "liability", "income", "expenditure", "capital"];
const typeTone = { asset: "blue", liability: "amber", income: "green", expenditure: "red", capital: "indigo" };

const ChartOfAccounts = ({ societyId }) => {
  const { showLoader, hideLoader } = useLoader();
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const [unmapped, setUnmapped] = useState([]);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mappingHead, setMappingHead] = useState(null);

  const fetchHeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAccountHeadsApi(societyId, typeFilter, search);
      setHeads(res?.heads || []);
    } catch (e) {
      toast.error(e?.message || "Failed to load Chart of Accounts");
    } finally {
      setLoading(false);
    }
  }, [societyId, typeFilter, search]);

  const fetchUnmapped = useCallback(async () => {
    try {
      const res = await listUnmappedChargeHeadsApi(societyId);
      setUnmapped(res?.heads || []);
    } catch (e) {
      // non-blocking
    }
  }, [societyId]);

  useEffect(() => { fetchHeads(); }, [fetchHeads]);
  useEffect(() => { fetchUnmapped(); }, [fetchUnmapped]);

  const handleSeed = async () => {
    showLoader?.();
    try {
      await seedChartOfAccountsApi(societyId);
      toast.success("Default Chart of Accounts created");
      fetchHeads();
    } catch (e) {
      toast.error(e?.message || "Failed to seed Chart of Accounts");
    } finally {
      hideLoader?.();
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ head_code: "", head_name: "", description: "", head_type: "asset", normal_balance: "debit",
      opening_balance: "0", opening_balance_type: "debit", opening_balance_date: "", is_active: 1 });
    setModalOpen(true);
  };

  const openEdit = (head) => {
    setEditing(head);
    setForm({ ...head, opening_balance: head.opening_balance ?? 0 });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.head_code || !form.head_name || !form.head_type || !form.normal_balance) {
      toast.error("Head code, name, type and normal balance are required");
      return;
    }
    showLoader?.();
    try {
      await upsertAccountHeadApi(societyId, { ...form, head_id: editing?.id || null });
      toast.success(editing ? "Account head updated" : "Account head created");
      setModalOpen(false);
      fetchHeads();
    } catch (e2) {
      toast.error(e2?.message || "Failed to save account head");
    } finally {
      hideLoader?.();
    }
  };

  const handleDelete = async (head) => {
    if (!window.confirm(`Delete "${head.head_name}"?`)) return;
    try {
      await deleteAccountHeadApi(societyId, head.id);
      toast.success("Account head deleted");
      fetchHeads();
    } catch (e) {
      toast.error(e?.message || "Failed to delete — it may already have entries");
    }
  };

  const openMapping = (chargeHead) => {
    setMappingHead(chargeHead);
    setMapModalOpen(true);
  };

  const handleMap = async (coaHeadId) => {
    try {
      await setChargeHeadAccountMappingApi(societyId, mappingHead.id, coaHeadId);
      toast.success(`"${mappingHead.head_name}" mapped successfully`);
      setMapModalOpen(false);
      fetchUnmapped();
    } catch (e) {
      toast.error(e?.message || "Failed to map charge head");
    }
  };

  const incomeHeads = heads.filter((h) => h.head_type === "income");

  return (
    <div>
      {unmapped.length > 0 && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-800 mb-2">
            {unmapped.length} billing charge head(s) not yet mapped to an income account — bills using them won't auto-post to Accounts.
          </p>
          <div className="flex flex-wrap gap-2">
            {unmapped.map((ch) => (
              <button
                key={ch.id}
                onClick={() => openMapping(ch)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-md text-xs font-medium text-amber-700 hover:bg-amber-100"
              >
                <FiLink size={12} /> {ch.head_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search heads…"
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="">All types</option>
            {HEAD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          {heads.length === 0 && !loading && (
            <Button variant="secondary" onClick={handleSeed}>
              <FiRefreshCw className="inline mr-1.5" size={14} /> Seed defaults
            </Button>
          )}
          <Button onClick={openCreate}>
            <FiPlus className="inline mr-1.5" size={14} /> New account head
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Normal Bal.</th>
              <th className="text-right px-4 py-3">Current Balance</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <LoadingRow colSpan={7} />
            ) : heads.length === 0 ? (
              <tr><td colSpan={7}><EmptyState message="No account heads yet — seed defaults or create one" /></td></tr>
            ) : (
              heads.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{h.head_code}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{h.head_name}</div>
                    {h.description && <div className="text-xs text-slate-400">{h.description}</div>}
                  </td>
                  <td className="px-4 py-3"><Badge tone={typeTone[h.head_type]}>{h.head_type}</Badge></td>
                  <td className="px-4 py-3 capitalize text-slate-600">{h.normal_balance}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">{money(h.current_balance)}</td>
                  <td className="px-4 py-3">
                    {h.is_active ? <Badge tone="green">Active</Badge> : <Badge tone="slate">Inactive</Badge>}
                    {h.is_system === 1 && <span className="ml-1"><Badge tone="indigo">System</Badge></span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(h)} className="text-slate-400 hover:text-indigo-600 p-1.5" title="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    {!h.is_system && (
                      <button onClick={() => handleDelete(h)} className="text-slate-400 hover:text-rose-600 p-1.5" title="Delete">
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Account Head" : "New Account Head"}>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-x-3">
            <Input label="Head code" value={form.head_code || ""} onChange={(e) => setForm({ ...form, head_code: e.target.value.toUpperCase() })} disabled={editing?.is_system === 1} required />
            <Input label="Head name" value={form.head_name || ""} onChange={(e) => setForm({ ...form, head_name: e.target.value })} required />
          </div>
          <Input label="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-x-3">
            <Select label="Type" value={form.head_type || ""} disabled={editing?.is_system === 1}
              onChange={(e) => setForm({ ...form, head_type: e.target.value })}
              options={HEAD_TYPES.map((t) => ({ value: t, label: t }))} required />
            <Select label="Normal balance" value={form.normal_balance || ""} disabled={editing?.is_system === 1}
              onChange={(e) => setForm({ ...form, normal_balance: e.target.value })}
              options={[{ value: "debit", label: "Debit" }, { value: "credit", label: "Credit" }]} required />
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <Input label="Opening balance" type="number" step="0.01" value={form.opening_balance ?? 0}
              onChange={(e) => setForm({ ...form, opening_balance: e.target.value })} />
            <Select label="Opening balance side" value={form.opening_balance_type || "debit"}
              onChange={(e) => setForm({ ...form, opening_balance_type: e.target.value })}
              options={[{ value: "debit", label: "Debit" }, { value: "credit", label: "Credit" }]} />
          </div>
          <Input label="Opening balance date" type="date" value={form.opening_balance_date || ""}
            onChange={(e) => setForm({ ...form, opening_balance_date: e.target.value })} />
          <label className="flex items-center gap-2 mt-1 mb-4 text-sm text-slate-600">
            <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
            Active
          </label>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">{editing ? "Save changes" : "Create head"}</Button>
          </div>
        </form>
      </Modal>

      {/* Mapping modal */}
      <Modal open={mapModalOpen} onClose={() => setMapModalOpen(false)} title={`Map "${mappingHead?.head_name || ""}" to an income account`}>
        <p className="text-sm text-slate-500 mb-3">
          Choose which income account this billing charge head should post to when bills are generated.
        </p>
        <div className="space-y-1.5 max-h-72 overflow-y-auto">
          {incomeHeads.length === 0 ? (
            <EmptyState message="No income accounts yet — seed the Chart of Accounts first" />
          ) : (
            incomeHeads.map((h) => (
              <button
                key={h.id}
                onClick={() => handleMap(h.id)}
                className="w-full text-left px-3 py-2.5 border border-slate-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-between"
              >
                <span>
                  <span className="font-mono text-xs text-slate-500 mr-2">{h.head_code}</span>
                  <span className="text-sm text-slate-700">{h.head_name}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ChartOfAccounts;
