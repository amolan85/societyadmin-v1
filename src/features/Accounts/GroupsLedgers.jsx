import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiBookOpen, FiPlus, FiLink } from "react-icons/fi";
import {
  seedStandardGroupsApi, listGroupsApi, seedChartOfAccountsApi,
  upsertAccountHeadApi, listAccountHeadsApi, deleteAccountHeadApi,
  listUnmappedChargeHeadsApi, setChargeHeadAccountMappingApi, syncAllChargeHeadLedgersApi,
} from "../../services/AccountsApi";
import { T, Badge, Modal, EmptyState, Button, Input, Select, money, FKeyBar, errMsg } from "./AccountsUI";

const GroupsLedgers = ({ societyId, onEscape }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unmapped, setUnmapped] = useState([]);

  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mappingHead, setMappingHead] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await listGroupsApi(societyId);
      setGroups(res?.groups || []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load groups"));
    }
  }, [societyId]);

  const fetchHeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAccountHeadsApi(societyId, selectedGroupId);
      setHeads(res?.heads || []);
    } catch (e) {
      toast.error(errMsg(e, "Failed to load ledgers"));
    } finally {
      setLoading(false);
    }
  }, [societyId, selectedGroupId]);

  const fetchUnmapped = useCallback(async () => {
    try {
      const res = await listUnmappedChargeHeadsApi(societyId);
      setUnmapped(res?.heads || []);
    } catch (e) { /* non-blocking */ }
  }, [societyId]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);
  useEffect(() => { fetchHeads(); }, [fetchHeads]);
  useEffect(() => { fetchUnmapped(); }, [fetchUnmapped]);

  const handleSeedGroups = async () => {
    try {
      await seedStandardGroupsApi(societyId);
      toast.success("Standard groups created");
      fetchGroups();
    } catch (e) {
      toast.error(errMsg(e, "Failed to seed groups"));
    }
  };

  const handleSeedLedgers = async () => {
    try {
      await seedChartOfAccountsApi(societyId);
      toast.success("Default ledgers created");
      fetchHeads();
    } catch (e) {
      toast.error(errMsg(e, "Failed to seed ledgers"));
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ head_code: "", head_name: "", description: "", group_id: selectedGroupId || "",
      opening_balance: "0", opening_balance_type: "debit", opening_balance_date: "", is_active: 1 });
    setLedgerModalOpen(true);
  };

  const openEdit = (head) => {
    setEditing(head);
    setForm({ ...head, opening_balance: head.opening_balance ?? 0 });
    setLedgerModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.head_code || !form.head_name || !form.group_id) {
      toast.error("Ledger code, name and Group are required");
      return;
    }
    try {
      await upsertAccountHeadApi(societyId, { ...form, head_id: editing?.id || null });
      toast.success(editing ? "Ledger updated" : "Ledger created");
      setLedgerModalOpen(false);
      fetchHeads();
    } catch (e2) {
      toast.error(errMsg(e2, "Failed to save ledger"));
    }
  };

  const handleDelete = async (head) => {
    if (!window.confirm(`Delete ledger "${head.head_name}"?`)) return;
    try {
      await deleteAccountHeadApi(societyId, head.id);
      toast.success("Ledger deleted");
      fetchHeads();
    } catch (e) {
      toast.error(errMsg(e, "Failed to delete — it may already have entries"));
    }
  };

  const handleSyncExisting = async () => {
    try {
      if (groups.length === 0) {
        await seedStandardGroupsApi(societyId);
      }
      const res = await syncAllChargeHeadLedgersApi(societyId);
      const s = res?.summary || {};
      toast.success(`Synced ${s.ledgers_synced || 0} charge head ledger(s)`);
      if (s.sync_failed > 0) toast.error(`${s.sync_failed} failed — see console`);
      fetchUnmapped();
      fetchGroups();
      fetchHeads();
    } catch (e) {
      toast.error(errMsg(e, "Failed to sync charge head ledgers"));
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
      toast.error(errMsg(e, "Failed to map charge head"));
    }
  };

  const primaryGroups = groups.filter((g) => g.is_primary);
  const subGroupsOf = (parentId) => groups.filter((g) => g.parent_group_id === parentId);
  const incomeGroups = groups.filter((g) => g.nature === "income");
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const groupBtnStyle = (active, indent = false) => ({
    display: "block", width: "100%", textAlign: "left", background: active ? T.colors.blue600 : "none",
    color: active ? T.colors.white : (indent ? T.colors.slate500 : T.colors.blue700),
    border: "none", cursor: "pointer",
    padding: indent ? "6px 12px 6px 28px" : "8px 12px",
    fontSize: 12, fontWeight: indent ? 400 : 600,
  });

  return (
    <div style={T.page}>
      <div style={T.headerBar}>
        <h1 style={T.headerTitle}><FiBookOpen size={16} /> Chart of Accounts — Groups &amp; Ledgers</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {groups.length === 0 && <Button onClick={handleSeedGroups}>Create Standard Groups</Button>}
          {groups.length > 0 && heads.length === 0 && !loading && (
            <Button variant="secondary" onClick={handleSeedLedgers}>Create Default Ledgers</Button>
          )}
        </div>
      </div>

      {unmapped.length > 0 && (
        <div style={{ margin: "16px 16px 0", padding: 12, backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{unmapped.length} billing charge head(s) predate auto-sync and have no linked income ledger yet.</span>
            <Button onClick={handleSyncExisting} style={{ flexShrink: 0 }}>Sync Now</Button>
          </div>
          <div style={{ fontSize: 11, marginTop: 6, opacity: 0.85 }}>
            New charge heads auto-create their ledger — this is only needed once, for ones created earlier. Or map each individually:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {unmapped.map((ch) => (
              <button key={ch.id} onClick={() => openMapping(ch)}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", backgroundColor: T.colors.white, border: "1px solid #fbbf24", borderRadius: 6, fontSize: 11, fontWeight: 500, color: "#92400e", cursor: "pointer" }}>
                <FiLink size={11} /> {ch.head_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 0, padding: 16, paddingBottom: 64 }}>
        <div style={{ ...T.panel, marginRight: 0 }}>
          <div style={T.panelHeader}>Groups</div>
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <button onClick={() => setSelectedGroupId(null)} style={groupBtnStyle(!selectedGroupId)}>All Ledgers</button>
            {primaryGroups.map((pg) => (
              <div key={pg.id}>
                <button onClick={() => setSelectedGroupId(pg.id)} style={groupBtnStyle(selectedGroupId === pg.id)}>
                  {pg.group_name} <span style={{ opacity: 0.6 }}>({pg.ledger_count})</span>
                </button>
                {subGroupsOf(pg.id).map((sg) => (
                  <button key={sg.id} onClick={() => setSelectedGroupId(sg.id)} style={groupBtnStyle(selectedGroupId === sg.id, true)}>
                    {sg.group_name} <span style={{ opacity: 0.6 }}>({sg.ledger_count})</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...T.panel, marginLeft: 16 }}>
          <div style={{ ...T.panelHeader, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{selectedGroup ? selectedGroup.group_name : "All Ledgers"}</span>
            <Button onClick={openCreate}><FiPlus size={13} /> F8 Create Ledger</Button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={T.th}>Code</th>
                <th style={T.th}>Ledger Name</th>
                <th style={T.th}>Group</th>
                <th style={{ ...T.th, textAlign: "right" }}>Closing Balance</th>
                <th style={T.th}>Status</th>
                <th style={T.th}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: T.colors.slate400, fontSize: 13 }}>Loading…</td></tr>
              ) : heads.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="No ledgers here yet" /></td></tr>
              ) : (
                heads.map((h) => (
                  <tr key={h.id} data-rownav style={T.row}>
                    <td style={{ ...T.td, fontFamily: "monospace", color: T.colors.slate500 }}>{h.head_code}</td>
                    <td style={T.td}>
                      {h.head_name}{" "}
                      {h.is_system === 1 && <Badge tone="indigo">SYS</Badge>}
                    </td>
                    <td style={{ ...T.td, color: T.colors.slate500 }}>{h.group_name}</td>
                    <td style={T.tdRight}>{money(h.current_balance)} {Number(h.current_balance) < 0 ? "Cr" : "Dr"}</td>
                    <td style={T.td}>{h.is_active ? <Badge tone="green">Active</Badge> : <Badge tone="slate">Inactive</Badge>}</td>
                    <td style={{ ...T.td, textAlign: "right" }}>
                      <button onClick={() => openEdit(h)} style={{ background: "none", border: "none", cursor: "pointer", color: T.colors.slate500, marginRight: 8, fontSize: 12 }}>Edit</button>
                      {!h.is_system && (
                        <button onClick={() => handleDelete(h)} style={{ background: "none", border: "none", cursor: "pointer", color: T.colors.red600, fontSize: 12 }}>Del</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={ledgerModalOpen} onClose={() => setLedgerModalOpen(false)} title={editing ? "Alter Ledger" : "Create Ledger"}>
        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Ledger code" value={form.head_code || ""} onChange={(e) => setForm({ ...form, head_code: e.target.value.toUpperCase() })} disabled={editing?.is_system === 1} required />
            <Input label="Ledger name" value={form.head_name || ""} onChange={(e) => setForm({ ...form, head_name: e.target.value })} required />
          </div>
          <Input label="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select label="Under Group" value={form.group_id || ""} disabled={editing?.is_system === 1}
            onChange={(e) => setForm({ ...form, group_id: e.target.value })}
            options={groups.map((g) => ({ value: g.id, label: `${g.is_primary ? "" : "— "}${g.group_name}` }))} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Opening balance" type="number" step="0.01" value={form.opening_balance ?? 0}
              onChange={(e) => setForm({ ...form, opening_balance: e.target.value })} />
            <Select label="Dr / Cr" value={form.opening_balance_type || "debit"}
              onChange={(e) => setForm({ ...form, opening_balance_type: e.target.value })}
              options={[{ value: "debit", label: "Debit" }, { value: "credit", label: "Credit" }]} />
          </div>
          <Input label="Opening balance date" type="date" value={form.opening_balance_date || ""}
            onChange={(e) => setForm({ ...form, opening_balance_date: e.target.value })} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, color: T.colors.slate600 }}>
            <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
            Active
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: `1px solid ${T.colors.border}` }}>
            <Button variant="secondary" type="button" onClick={() => setLedgerModalOpen(false)}>Cancel (Esc)</Button>
            <Button type="submit">{editing ? "Save changes" : "Create ledger"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={mapModalOpen} onClose={() => setMapModalOpen(false)} title={`Map "${mappingHead?.head_name || ""}" to income ledger`}>
        <p style={{ fontSize: 12, color: T.colors.slate500, marginBottom: 12 }}>Choose the income ledger this billing charge head should post to.</p>
        <div style={{ maxHeight: 280, overflowY: "auto" }}>
          {incomeGroups.length === 0 ? (
            <EmptyState message="No income groups yet" />
          ) : (
            heads.filter((h) => h.group_nature === "income" || incomeGroups.some((g) => g.id === h.group_id)).map((h) => (
              <button key={h.id} onClick={() => handleMap(h.id)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", border: `1px solid ${T.colors.border}`, borderRadius: 6, marginBottom: 6, background: T.colors.white, cursor: "pointer" }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: T.colors.slate500, marginRight: 8 }}>{h.head_code}</span>
                <span style={{ fontSize: 13, color: T.colors.slate700 }}>{h.head_name}</span>
              </button>
            ))
          )}
        </div>
      </Modal>

      <FKeyBar items={[{ key: "F8", label: "Create Ledger", onPress: openCreate }]} onEscape={onEscape} />
    </div>
  );
};

export default GroupsLedgers;
