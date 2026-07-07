import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiEye, FiCheck, FiRotateCcw, FiTrash2, FiSearch } from "react-icons/fi";
import { useLoader } from "../../context/LoaderContext";
import {
  createJournalApi, addJournalLineApi, removeJournalLineApi, postJournalApi,
  reverseJournalApi, getJournalApi, listJournalsApi, listAccountHeadsApi,
} from "../../services/AccountsApi";
import { Badge, Modal, EmptyState, LoadingRow, Button, Input, Select, money, fmtDate, statusTone } from "./AccountsUI";

const JournalEntry = ({ societyId }) => {
  const { showLoader, hideLoader } = useLoader();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, page_size: 15, total: 0, total_pages: 0 });
  const [filters, setFilters] = useState({ status: "", search: "" });

  const [heads, setHeads] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeJournal, setActiveJournal] = useState(null);
  const [lineForm, setLineForm] = useState({ head_id: "", entry_type: "debit", amount: "", flat_id: "", narration: "" });
  const [newJournal, setNewJournal] = useState({ journal_date: new Date().toISOString().slice(0, 10), narration: "" });

  const fetchJournals = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await listJournalsApi(societyId, filters, page, pagination.page_size);
      setJournals(res?.journals || []);
      setPagination(res?.pagination || pagination);
    } catch (e) {
      toast.error(e?.message || "Failed to load journals");
    } finally {
      setLoading(false);
    }
  }, [societyId, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchHeads = useCallback(async () => {
    try {
      const res = await listAccountHeadsApi(societyId);
      setHeads(res?.heads || []);
    } catch (e) { /* non-blocking */ }
  }, [societyId]);

  useEffect(() => { fetchJournals(1); }, [fetchJournals]);
  useEffect(() => { fetchHeads(); }, [fetchHeads]);

  const openDetail = async (journalId) => {
    showLoader?.();
    try {
      const res = await getJournalApi(societyId, journalId);
      setActiveJournal(res);
      setDetailModalOpen(true);
    } catch (e) {
      toast.error(e?.message || "Failed to load journal");
    } finally {
      hideLoader?.();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newJournal.journal_date) { toast.error("Journal date is required"); return; }
    showLoader?.();
    try {
      const journal = await createJournalApi(societyId, newJournal);
      toast.success(`Journal ${journal.journal_no} created (draft)`);
      setCreateModalOpen(false);
      setNewJournal({ journal_date: new Date().toISOString().slice(0, 10), narration: "" });
      fetchJournals(1);
      openDetail(journal.id);
    } catch (e2) {
      toast.error(e2?.message || "Failed to create journal");
    } finally {
      hideLoader?.();
    }
  };

  const handleAddLine = async (e) => {
    e.preventDefault();
    if (!lineForm.head_id || !lineForm.amount || Number(lineForm.amount) <= 0) {
      toast.error("Account head and a positive amount are required");
      return;
    }
    try {
      await addJournalLineApi(societyId, { ...lineForm, journal_id: activeJournal.id });
      toast.success("Line added");
      setLineForm({ head_id: "", entry_type: "debit", amount: "", flat_id: "", narration: "" });
      const refreshed = await getJournalApi(societyId, activeJournal.id);
      setActiveJournal(refreshed);
    } catch (e2) {
      toast.error(e2?.message || "Failed to add line");
    }
  };

  const handleRemoveLine = async (entryId) => {
    try {
      await removeJournalLineApi(societyId, activeJournal.id, entryId);
      toast.success("Line removed");
      const refreshed = await getJournalApi(societyId, activeJournal.id);
      setActiveJournal(refreshed);
    } catch (e) {
      toast.error(e?.message || "Failed to remove line");
    }
  };

  const handlePost = async () => {
    if (!window.confirm("Post this journal? It becomes immutable once posted.")) return;
    showLoader?.();
    try {
      await postJournalApi(societyId, activeJournal.id);
      toast.success("Journal posted");
      const refreshed = await getJournalApi(societyId, activeJournal.id);
      setActiveJournal(refreshed);
      fetchJournals(pagination.page);
    } catch (e) {
      toast.error(e?.message || "Failed to post journal");
    } finally {
      hideLoader?.();
    }
  };

  const handleReverse = async () => {
    const reason = window.prompt("Reason for reversal:");
    if (reason === null) return;
    showLoader?.();
    try {
      const reversal = await reverseJournalApi(societyId, activeJournal.id, null, reason);
      toast.success(`Reversal journal ${reversal.journal_no} posted`);
      setDetailModalOpen(false);
      fetchJournals(pagination.page);
    } catch (e) {
      toast.error(e?.message || "Failed to reverse journal");
    } finally {
      hideLoader?.();
    }
  };

  const totalDebit = activeJournal?.lines?.filter(l => l.entry_type === "debit").reduce((s, l) => s + Number(l.amount), 0) || 0;
  const totalCredit = activeJournal?.lines?.filter(l => l.entry_type === "credit").reduce((s, l) => s + Number(l.amount), 0) || 0;
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search journal no / narration…"
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="posted">Posted</option>
            <option value="reversed">Reversed</option>
          </select>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <FiPlus className="inline mr-1.5" size={14} /> New journal entry
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Journal No</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Narration</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <LoadingRow colSpan={7} />
            ) : journals.length === 0 ? (
              <tr><td colSpan={7}><EmptyState message="No journals found" /></td></tr>
            ) : (
              journals.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{j.journal_no}</td>
                  <td className="px-4 py-3 text-slate-600">{fmtDate(j.journal_date)}</td>
                  <td className="px-4 py-3 capitalize text-slate-500">{j.journal_type}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{j.narration}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">{money(j.total_debit)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(j.status)}>{j.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openDetail(j.id)} className="text-slate-400 hover:text-indigo-600 p-1.5" title="View">
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
            <span>Page {pagination.page} of {pagination.total_pages} ({pagination.total} total)</span>
            <div className="flex gap-1">
              <Button variant="secondary" disabled={pagination.page <= 1} onClick={() => fetchJournals(pagination.page - 1)}>Prev</Button>
              <Button variant="secondary" disabled={pagination.page >= pagination.total_pages} onClick={() => fetchJournals(pagination.page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Create journal modal */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="New Journal Entry">
        <form onSubmit={handleCreate}>
          <Input label="Journal date" type="date" value={newJournal.journal_date}
            onChange={(e) => setNewJournal({ ...newJournal, journal_date: e.target.value })} required />
          <Input label="Narration" value={newJournal.narration}
            onChange={(e) => setNewJournal({ ...newJournal, narration: e.target.value })} placeholder="What is this entry for?" />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-2">
            <Button variant="secondary" type="button" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create draft</Button>
          </div>
        </form>
      </Modal>

      {/* Journal detail / line-editor modal */}
      <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} title={activeJournal ? `Journal ${activeJournal.journal_no}` : ""} width="max-w-2xl">
        {activeJournal && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-slate-500">{fmtDate(activeJournal.journal_date)} · {activeJournal.narration}</div>
              </div>
              <Badge tone={statusTone(activeJournal.status)}>{activeJournal.status}</Badge>
            </div>

            <table className="w-full text-sm mb-3">
              <thead className="text-xs text-slate-400 uppercase">
                <tr>
                  <th className="text-left pb-2">Account</th>
                  <th className="text-right pb-2">Debit</th>
                  <th className="text-right pb-2">Credit</th>
                  {activeJournal.status === "draft" && <th className="pb-2"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeJournal.lines || []).map((l) => (
                  <tr key={l.id}>
                    <td className="py-2">
                      <div className="text-slate-700">{l.head_name}</div>
                      {l.narration && <div className="text-xs text-slate-400">{l.narration}</div>}
                    </td>
                    <td className="py-2 text-right">{l.entry_type === "debit" ? money(l.amount) : ""}</td>
                    <td className="py-2 text-right">{l.entry_type === "credit" ? money(l.amount) : ""}</td>
                    {activeJournal.status === "draft" && (
                      <td className="py-2 text-right">
                        <button onClick={() => handleRemoveLine(l.id)} className="text-slate-300 hover:text-rose-600">
                          <FiTrash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold border-t border-slate-200">
                  <td className="pt-2">Total</td>
                  <td className="pt-2 text-right">{money(totalDebit)}</td>
                  <td className="pt-2 text-right">{money(totalCredit)}</td>
                  {activeJournal.status === "draft" && <td></td>}
                </tr>
              </tfoot>
            </table>

            {activeJournal.status === "draft" && !isBalanced && (
              <p className="text-xs text-amber-600 mb-3">
                Debit and credit totals must match before this journal can be posted.
              </p>
            )}

            {activeJournal.status === "draft" && (
              <form onSubmit={handleAddLine} className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                <div className="grid grid-cols-4 gap-2 items-end">
                  <div className="col-span-2">
                    <Select label="Account" value={lineForm.head_id} className="!mb-0"
                      onChange={(e) => setLineForm({ ...lineForm, head_id: e.target.value })}
                      options={heads.map((h) => ({ value: h.id, label: `${h.head_code} — ${h.head_name}` }))} />
                  </div>
                  <Select label="Type" value={lineForm.entry_type} className="!mb-0"
                    onChange={(e) => setLineForm({ ...lineForm, entry_type: e.target.value })}
                    options={[{ value: "debit", label: "Debit" }, { value: "credit", label: "Credit" }]} />
                  <Input label="Amount" type="number" step="0.01" className="!mb-0" value={lineForm.amount}
                    onChange={(e) => setLineForm({ ...lineForm, amount: e.target.value })} />
                </div>
                <Input label="Narration (optional)" value={lineForm.narration}
                  onChange={(e) => setLineForm({ ...lineForm, narration: e.target.value })} />
                <Button type="submit" variant="secondary" className="w-full mt-1">
                  <FiPlus className="inline mr-1" size={13} /> Add line
                </Button>
              </form>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              {activeJournal.status === "draft" && (
                <Button onClick={handlePost} disabled={!isBalanced || (activeJournal.lines || []).length < 2}>
                  <FiCheck className="inline mr-1.5" size={14} /> Post journal
                </Button>
              )}
              {activeJournal.status === "posted" && (
                <Button variant="danger" onClick={handleReverse}>
                  <FiRotateCcw className="inline mr-1.5" size={14} /> Reverse journal
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JournalEntry;
