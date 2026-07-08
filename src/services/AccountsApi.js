import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

const MODULE = "accounts/";

// Generic POST helper — societyId passed explicitly by the caller on every
// call, matching AddMemberApi.js (no internal session lookup in this file).
const accountsPost = async (endpoint, societyId, payload = {}) => {
  try {
    const res = await apiClient({
      method: "post",
      url: UrlData + MODULE + endpoint,
      data: { society_id: societyId, ...payload },
      timeout: 30000,
    });
    return res.data.data;
  } catch (error) {
    const errors = ErrorHandler(error);
    console.log(errors, `Errors: ${endpoint}`);
    throw errors;
  }
};

// Waive Off lives in the Billing module (SP_WaiveOff), not Accounts — this
// hits it directly so the guided "Waive Off" flow can live in the Accounts
// UI (Collection Register) without duplicating billing logic. The
// resulting waiveoff_transactions row is auto-journaled into Accounts by
// the existing billing_controller.py → accounts_controller.py bridge.
export const waiveOffApi = (societyId, billId, waiveType, waiveAmount, reason) =>
  apiClient({
    method: "post",
    url: UrlData + "billing/WaiveOff",
    data: { society_id: societyId, bill_id: billId, waive_type: waiveType, waive_amount: waiveAmount || null, reason },
    timeout: 30000,
  }).then((res) => res.data.data).catch((error) => { throw ErrorHandler(error); });

// ── Groups (Tally hierarchy) ────────────────────────────────────
export const seedStandardGroupsApi = (societyId) => accountsPost("SeedStandardGroups", societyId);
export const listGroupsApi = (societyId) => accountsPost("ListGroups", societyId);
export const getGroupSummaryApi = (societyId, asOfDate = "") => accountsPost("GetGroupSummary", societyId, { as_of_date: asOfDate });
export const backfillLedgerGroupsApi = (societyId) => accountsPost("BackfillLedgerGroups", societyId);
export const setLedgerRoleApi = (societyId, headId, role) => accountsPost("SetLedgerRole", societyId, { head_id: headId, role });
export const getSystemRoleStatusApi = (societyId) => accountsPost("GetSystemRoleStatus", societyId);
export const listLedgersByTypeApi = (societyId, headType = "") => accountsPost("ListLedgersByType", societyId, { head_type: headType });

// ── Chart of Accounts (Ledgers) ──────────────────────────────────
export const seedChartOfAccountsApi = (societyId) => accountsPost("SeedChartOfAccounts", societyId);
export const upsertAccountHeadApi = (societyId, payload) => accountsPost("UpsertAccountHead", societyId, payload);
export const listAccountHeadsApi = (societyId, groupId = null, headType = "", search = "", isActive = null) =>
  accountsPost("ListAccountHeads", societyId, { group_id: groupId, head_type: headType, search, is_active: isActive });
export const deleteAccountHeadApi = (societyId, headId) => accountsPost("DeleteAccountHead", societyId, { head_id: headId });
export const getAccountHeadLedgerApi = (societyId, headId, fromDate = "", toDate = "") =>
  accountsPost("GetAccountHeadLedger", societyId, { head_id: headId, from_date: fromDate, to_date: toDate });

// ── Day Book / Cash Book / Bank Book ─────────────────────────────
export const getDayBookApi = (societyId, dateFrom, dateTo, voucherType = "") =>
  accountsPost("GetDayBook", societyId, { date_from: dateFrom, date_to: dateTo, voucher_type: voucherType });
export const getCashBookApi = (societyId, dateFrom, dateTo) =>
  accountsPost("GetCashBook", societyId, { date_from: dateFrom, date_to: dateTo });
export const getBankBookApi = (societyId, headId, dateFrom, dateTo) =>
  accountsPost("GetBankBook", societyId, { head_id: headId, date_from: dateFrom, date_to: dateTo });

// ── Journal ─────────────────────────────────────────────────────
export const createJournalApi = (societyId, payload) => accountsPost("CreateJournal", societyId, payload);
export const addJournalLineApi = (societyId, payload) => accountsPost("AddJournalLine", societyId, payload);
export const removeJournalLineApi = (societyId, journalId, entryId) =>
  accountsPost("RemoveJournalLine", societyId, { journal_id: journalId, entry_id: entryId });
export const postJournalApi = (societyId, journalId) => accountsPost("PostJournal", societyId, { journal_id: journalId });
export const reverseJournalApi = (societyId, journalId, reversalDate, reason) =>
  accountsPost("ReverseJournal", societyId, { journal_id: journalId, reversal_date: reversalDate, reason });
export const getJournalApi = (societyId, journalId) => accountsPost("GetJournal", societyId, { journal_id: journalId });
export const listJournalsApi = (societyId, filters = {}, page = 1, pageSize = 10) =>
  accountsPost("ListJournals", societyId, { ...filters, page, page_size: pageSize });

// ── Bank & Cash ─────────────────────────────────────────────────
export const upsertBankAccountApi = (societyId, payload) => accountsPost("UpsertBankAccount", societyId, payload);
export const listBankAccountsApi = (societyId, accountType = "", isActive = null) =>
  accountsPost("ListBankAccounts", societyId, { account_type: accountType, is_active: isActive });
export const startBankReconciliationApi = (societyId, payload) => accountsPost("StartBankReconciliation", societyId, payload);
export const matchReconciliationItemApi = (societyId, reconciliationId, entryId, isMatched, remarks = "") =>
  accountsPost("MatchReconciliationItem", societyId, { reconciliation_id: reconciliationId, entry_id: entryId, is_matched: isMatched ? 1 : 0, remarks });
export const completeBankReconciliationApi = (societyId, reconciliationId) =>
  accountsPost("CompleteBankReconciliation", societyId, { reconciliation_id: reconciliationId });
export const getBankReconciliationApi = (societyId, reconciliationId) =>
  accountsPost("GetBankReconciliation", societyId, { reconciliation_id: reconciliationId });

// ── Period Lock / Audit ───────────────────────────────────────────
export const lockPeriodApi = (societyId, payload) => accountsPost("LockPeriod", societyId, payload);
export const unlockPeriodApi = (societyId, periodMonth, periodYear) =>
  accountsPost("UnlockPeriod", societyId, { period_month: periodMonth, period_year: periodYear });
export const listPeriodsApi = (societyId, financialYear = "") => accountsPost("ListPeriods", societyId, { financial_year: financialYear });

// ── Budget ──────────────────────────────────────────────────────
export const upsertBudgetApi = (societyId, payload) => accountsPost("UpsertBudget", societyId, payload);
export const autoSplitBudgetMonthlyApi = (societyId, budgetId, startYear, startMonth) =>
  accountsPost("AutoSplitBudgetMonthly", societyId, { budget_id: budgetId, start_year: startYear, start_month: startMonth });
export const setBudgetAllocationApi = (societyId, payload) => accountsPost("SetBudgetAllocation", societyId, payload);
export const getBudgetVsActualApi = (societyId, financialYear, headId = null) =>
  accountsPost("GetBudgetVsActual", societyId, { financial_year: financialYear, head_id: headId });
export const listBudgetsApi = (societyId, financialYear = "") => accountsPost("ListBudgets", societyId, { financial_year: financialYear });

// ── Reports ─────────────────────────────────────────────────────
export const getTrialBalanceApi = (societyId, asOfDate = "") => accountsPost("GetTrialBalance", societyId, { as_of_date: asOfDate });
export const getBalanceSheetApi = (societyId, asOfDate = "", comparePrevYear = false) =>
  accountsPost("GetBalanceSheet", societyId, { as_of_date: asOfDate, compare_prev_year: comparePrevYear ? 1 : 0 });
export const getIncomeExpenditureStatementApi = (societyId, fromDate, toDate, comparePrevYear = false) =>
  accountsPost("GetIncomeExpenditureStatement", societyId, { from_date: fromDate, to_date: toDate, compare_prev_year: comparePrevYear ? 1 : 0 });

// ── Billing bridge ──────────────────────────────────────────────
export const setChargeHeadAccountMappingApi = (societyId, headId, coaHeadId) =>
  accountsPost("SetChargeHeadAccountMapping", societyId, { head_id: headId, coa_head_id: coaHeadId });
export const listUnmappedChargeHeadsApi = (societyId) => accountsPost("ListUnmappedChargeHeads", societyId);
export const syncAllChargeHeadLedgersApi = (societyId) => accountsPost("SyncAllChargeHeadLedgers", societyId);
export const getAccountsSyncStatusApi = (societyId) => accountsPost("GetAccountsSyncStatus", societyId);
export const fixAllSyncIssuesApi = (societyId) => accountsPost("FixAllSyncIssues", societyId);
export const retryBillJournalApi = (societyId, billId) => accountsPost("RetryBillJournal", societyId, { bill_id: billId });
export const getCollectionRegisterApi = (societyId, dateFrom, dateTo) =>
  accountsPost("GetCollectionRegister", societyId, { date_from: dateFrom, date_to: dateTo });
export const getBillAuditTrailApi = (societyId, billId) => accountsPost("GetBillAuditTrail", societyId, { bill_id: billId });
export const backfillHistoricalBillingJournalsApi = (societyId) => accountsPost("BackfillHistoricalBillingJournals", societyId);
export const backfillHistoricalWalletJournalsApi = (societyId) => accountsPost("BackfillHistoricalWalletJournals", societyId);
