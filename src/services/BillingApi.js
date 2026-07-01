import apiClient from "./ApiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";
import { GetSessionData } from "../utils/SessionManagement";

const getSocietyId = () => {
    const s = GetSessionData();
    return s?.data?.flats?.[0]?.society_id || s?.data?.society_id || s?.society_id || null;
};

const billingPost = async (endpoint, payload = {}, timeout = 30000) => {
    try {
        const response = await apiClient({
            method: "post",
            url:    UrlData + "billing/" + endpoint,
            data:   { society_id: getSocietyId(), ...payload },
            timeout,
        });
        return response.data.data;
    } catch (error) {
        throw ErrorHandler(error);
    }
};

// ── Billing Settings ──────────────────────────────────────────────────────────
export const upsertBillingSettingsApi = async (data) =>
    billingPost("UpsertBillingSettings", {
        // Basic
        timezone:               data.timezone                || 'Asia/Kolkata',
        financial_year:         data.financial_year          || null,
        fy_start_date:          null,
        fy_end_date:            null,
        interest_rate:          data.interest_rate    != null ? parseFloat(data.interest_rate)          : null,
        interest_type:          data.interest_type           || null,
        interest_enabled:       data.interest_enabled != null ? parseInt(data.interest_enabled)         : null,
        due_day:                data.due_day          != null ? parseInt(data.due_day)                  : null,
        roundoff:               data.roundoff         != null ? parseInt(data.roundoff)                 : null,
        startup_month:          data.startup_month           || null,
        startup_bill_no:        data.startup_bill_no  != null ? parseInt(data.startup_bill_no)         : null,
        bill_type:              data.bill_type               || null,
        notes:                  data.notes                   || null,
        additional_notes:       data.additional_notes        || null,
        // Automation
        bill_frequency:         data.bill_frequency          || null,
        auto_generate:          data.auto_generate    != null ? parseInt(data.auto_generate)            : null,
        generation_day:         data.generation_day   != null ? parseInt(data.generation_day)           : null,
        due_date_type:          data.due_date_type           || null,
        due_date_value:         data.due_date_value   != null ? parseInt(data.due_date_value)           : null,
        penalty_enabled:        data.penalty_enabled  != null ? parseInt(data.penalty_enabled)          : null,
        penalty_type:           data.penalty_type            || null,
        penalty_value:          data.penalty_value    != null ? parseFloat(data.penalty_value)          : null,
        penalty_frequency:      data.penalty_frequency       || null,
        use_system_fy:          data.use_system_fy    != null ? parseInt(data.use_system_fy)            : null,
        custom_fy_start_month:  data.custom_fy_start_month != null ? parseInt(data.custom_fy_start_month) : null,
        custom_fy_start_day:    data.custom_fy_start_day   != null ? parseInt(data.custom_fy_start_day)   : null,
    });

export const getBillingSettingsApi = async () => billingPost("GetBillingSettings", {});

// ── Charge Heads ──────────────────────────────────────────────────────────────
export const upsertChargeHeadApi = async (data) => {
    const cb  = data.charge_basis || "fixed";
    const gst = data.gst_rule     || "exempt";
    return billingPost("UpsertChargeHead", {
        head_id:             data.head_id ? parseInt(data.head_id) : null,
        head_code:           (data.head_code  || "").toUpperCase().trim() || null,
        head_name:           (data.head_name  || "").trim() || null,
        head_group:          (data.head_group || "").trim() || null,
        charge_scope:        data.charge_scope || "centralised",
        charge_basis:        cb,
        // Only send amount relevant to chosen basis
        centralised_amount:  cb === "fixed"
            ? (data.centralised_amount !== "" && data.centralised_amount != null
                ? parseFloat(data.centralised_amount) : 0)
            : null,
        centralised_rate:    cb === "per_sqft"
            ? (data.centralised_rate !== "" && data.centralised_rate != null
                ? parseFloat(data.centralised_rate) : 0)
            : null,
        percentage_rate:     cb === "percentage"
            ? (parseFloat(data.percentage_rate) || 0)
            : null,
        percentage_of_heads: cb === "percentage"
            ? (Array.isArray(data.percentage_of_heads)
                ? data.percentage_of_heads.join(",")
                : data.percentage_of_heads || null)
            : null,
        applies_to_types:    Array.isArray(data.applies_to_types)
            ? data.applies_to_types.join(",")
            : (data.applies_to_types || "residential_flat,commercial_shop,commercial_office"),
        is_active:           data.is_active  != null ? parseInt(data.is_active)  : 1,
        sort_order:          data.sort_order != null ? parseInt(data.sort_order) : 99,
        // GST
        gst_rule:  gst,
        cgst_rate: parseFloat(data.cgst_rate || 0),
        sgst_rate: parseFloat(data.sgst_rate || 0),
        igst_rate: parseFloat(data.igst_rate || 0),
        sac_code:  data.sac_code  || null,
        gst_notes: data.gst_notes || null,
    });
};

export const autoApplyChargeHeadApi = async (headId) =>
    billingPost("AutoApplyChargeHead", { head_id: parseInt(headId) });

export const deleteChargeHeadApi    = async (headId)     => billingPost("DeleteChargeHead",    { head_id: parseInt(headId) });
export const listChargeHeadsApi     = async (appliesTo="")=> billingPost("ListChargeHeads",     { applies_to: appliesTo || "" });

// ── Flat Charge Config ────────────────────────────────────────────────────────
export const setFlatChargeConfigApi = async (data) =>
    billingPost("SetFlatChargeConfig", {
        flat_id: parseInt(data.flat_id), head_id: parseInt(data.head_id),
        amount: parseFloat(data.amount),
        effective_from: data.effective_from || null, effective_to: data.effective_to || null,
    });

export const getFlatChargeConfigApi   = async (flatId)       => billingPost("GetFlatChargeConfig",   { flat_id: parseInt(flatId) });
export const resetFlatChargeOverrideApi = async (flatId, headId) => billingPost("ResetFlatChargeOverride", { flat_id: parseInt(flatId), head_id: parseInt(headId) });

export const overrideFlatChargeApi = async (data) =>
    billingPost("OverrideFlatCharge", {
        flat_id: parseInt(data.flat_id), head_id: parseInt(data.head_id),
        charge_type:   data.charge_type   || "fixed",
        amount:        data.amount        != null ? parseFloat(data.amount)        : null,
        rate_per_sqft: data.rate_per_sqft != null ? parseFloat(data.rate_per_sqft) : null,
        effective_from: data.effective_from || null, effective_to: data.effective_to || null,
    });

export const listFlatChargeConfigsApi = async (filters = {}) =>
    billingPost("ListFlatChargeConfigs", {
        head_id:       filters.headId       ? parseInt(filters.headId)             : null,
        property_type: filters.propertyType || "",
        flat_id:       filters.flatId       ? parseInt(filters.flatId)             : null,
        is_override:   filters.isOverride   != null ? parseInt(filters.isOverride) : null,
        search:        filters.search       || "",
        page:          filters.page         ? parseInt(filters.page)               : 1,
        page_size:     filters.pageSize     ? parseInt(filters.pageSize)           : 20,
    });

export const addFlatChargeApi = async (data) =>
    billingPost("AddFlatCharge", {
        flat_id:       parseInt(data.flat_id),
        head_id:       parseInt(data.head_id),
        charge_type:   data.charge_type  || data.charge_basis || "fixed",
        charge_basis:  data.charge_basis || data.charge_type  || "fixed",
        amount:        data.charge_type === "percentage"
                           ? 0  // placeholder; computed at bill gen
                           : data.amount != null ? parseFloat(data.amount) : null,
        rate_per_sqft: data.rate_per_sqft != null ? parseFloat(data.rate_per_sqft) : null,
        effective_from: data.effective_from || null,
        effective_to:   data.effective_to   || null,
    });

export const removeFlatChargeApi = async (fccId) =>
    billingPost("RemoveFlatCharge", { fcc_id: parseInt(fccId) });

// ── Opening Balance ───────────────────────────────────────────────────────────
export const setOpeningBalanceApi = async (data) =>
    billingPost("SetOpeningBalance", {
        flat_id:    parseInt(data.flat_id), as_of_date: data.as_of_date,
        principal:  data.principal != null ? parseFloat(data.principal) : 0,
        interest:   data.interest  != null ? parseFloat(data.interest)  : 0,
        remarks:    data.remarks   || null,
    });

// ── Bills ─────────────────────────────────────────────────────────────────────
export const generateBillApi = async (data) =>
    billingPost("GenerateBill", {
        flat_id:      parseInt(data.flat_id),
        bill_month:   data.bill_month,
        bill_year:    parseInt(data.bill_year),
        bill_date:    data.bill_date   || null,
        due_date:     data.due_date    || null,
        apply_wallet: data.apply_wallet ? 1 : 0,
    }, 60000);

export const regenerateBillApi = async (billId, applyWallet = false) =>
    billingPost("RegenerateBill", {
        bill_id:      parseInt(billId),
        apply_wallet: applyWallet ? 1 : 0,
    }, 60000);

export const generateBillsForAllApi = async (billMonth, billYear, options = {}) =>
    billingPost("GenerateBillsForAll", {
        bill_month:   billMonth,
        bill_year:    parseInt(billYear),
        bill_date:    options.billDate    || null,
        due_date:     options.dueDate     || null,
        apply_wallet: options.applyWallet ? 1 : 0,
        regenerate:   options.regenerate  ? 1 : 0,
    }, 120000);

export const generateYearlyBillsApi = async (data) =>
    billingPost("GenerateYearlyBills", {
        flat_id:           data.flatId           ? parseInt(data.flatId)           : null,
        start_month:       data.startMonth,
        start_year:        parseInt(data.startYear),
        months_count:      parseInt(data.monthsCount || 12),
        apply_wallet:      data.applyWallet       ? 1 : 0,
        advance_discount:  data.advanceDiscount   ? parseFloat(data.advanceDiscount) : 0,
    }, 180000);

export const getBillApi   = async (billId)     => billingPost("GetBill",   { bill_id: parseInt(billId) });

export const listBillsApi = async (filters = {}) =>
    billingPost("ListBills", {
        flat_id:      filters.flatId      ? parseInt(filters.flatId)      : null,
        status:       filters.status      || "",
        bill_month:   filters.billMonth   || "",
        bill_year:    filters.billYear    ? parseInt(filters.billYear)    : null,
        overdue_only: filters.overdueOnly ? 1 : 0,
        page:         filters.page        ? parseInt(filters.page)        : 1,
        page_size:    filters.pageSize    ? parseInt(filters.pageSize)    : 10,
    });

// ── Payments ──────────────────────────────────────────────────────────────────
export const recordPaymentApi = async (data) =>
    billingPost("RecordPayment", {
        flat_id:          parseInt(data.flat_id),
        bill_id:          data.bill_id         ? parseInt(data.bill_id)             : null,
        bill_month:       data.bill_month       || null,
        bill_year:        data.bill_year        ? parseInt(data.bill_year)          : null,
        receipt_date:     data.receipt_date     || null,
        principal_amount: data.principal_amount ? parseFloat(data.principal_amount) : null,
        interest_amount:  data.interest_amount  ? parseFloat(data.interest_amount)  : null,
        payment_mode:     data.payment_mode,
        bank_name:        data.bank_name        || null,
        branch:           data.branch           || null,
        cheque_no:        data.cheque_no        || null,
        transaction_ref:  data.transaction_ref  || null,
        narration:        data.narration        || null,
    });

// ── Wallet ────────────────────────────────────────────────────────────────────
// export const creditWalletApi = async (flatId, amount, txnSource = "payment", narration = null) =>
//     billingPost("CreditWallet", {
//         flat_id:    parseInt(flatId),
//         amount:     parseFloat(amount),
//         txn_source: txnSource || "payment",
//         narration:  narration || null,
//     });

export const getWalletDetailsApi    = async (flatId) => billingPost("GetWalletDetails",  { flat_id: parseInt(flatId) });
export const listWalletBalancesApi  = async (page=1, pageSize=20) => billingPost("ListWalletBalances", { page, page_size: pageSize });

export const applyWalletToBillApi = async (billId, amount = null) =>
    billingPost("ApplyWalletToBill", {
        bill_id: parseInt(billId),
        amount:  amount ? parseFloat(amount) : null,
    });

// ── Ledger & Summary ──────────────────────────────────────────────────────────
export const getFlatLedgerApi = async (flatId, fromYear=null, toYear=null) =>
    billingPost("GetFlatLedger", {
        flat_id:   parseInt(flatId),
        from_year: fromYear ? parseInt(fromYear) : null,
        to_year:   toYear   ? parseInt(toYear)   : null,
    });

export const getBillingSummaryApi = async (billMonth="", billYear=null) =>
    billingPost("GetBillingSummary", {
        bill_month: billMonth || "",
        bill_year:  billYear  ? parseInt(billYear) : null,
    });

// ─── Generate Bill + Pay at same time ─────────────────────────────────────────
export const generateBillAndPayApi = async (data) =>
    billingPost("GenerateBillAndPay", {
        flat_id:          parseInt(data.flat_id),
        bill_month:       data.bill_month,
        bill_year:        parseInt(data.bill_year),
        bill_date:        data.bill_date        || null,
        due_date:         data.due_date         || null,
        principal_amount: data.principal_amount ? parseFloat(data.principal_amount) : null,
        interest_amount:  data.interest_amount  ? parseFloat(data.interest_amount)  : 0,
        payment_mode:     data.payment_mode,
        bank_name:        data.bank_name        || null,
        branch:           data.branch           || null,
        cheque_no:        data.cheque_no        || null,
        transaction_ref:  data.transaction_ref  || null,
        narration:        data.narration        || null,
        send_email:       data.send_email !== false ? true : false,
    }, 60000);

// ─── Resend receipt email ──────────────────────────────────────────────────────
export const getReceiptPdfApi  = async (receiptId) =>
    billingPost("GetReceiptPdf", { receipt_id: parseInt(receiptId) });

export const resendReceiptApi = async (receiptId) =>
    billingPost("ResendReceipt", {
        receipt_id: parseInt(receiptId),
    });

// ─── Credit wallet (updated — with email) ─────────────────────────────────────
export const creditWalletApi = async (data) =>
    billingPost("CreditWallet", {
        flat_id:        parseInt(data.flat_id),
        amount:         parseFloat(data.amount),
        txn_source:     data.txn_source     || "payment",
        narration:      data.narration      || null,
        bank_name:      data.bank_name      || null,
        transaction_ref:data.transaction_ref|| null,
        credit_date:    data.credit_date    || null,
        send_email:     data.send_email !== false ? true : false,
    });

// ─────────────────────────────────────────────────────────────────────────────
// Financial Year
// ─────────────────────────────────────────────────────────────────────────────
export const getFinancialYearApi = async (date = null) =>
    billingPost("GetFinancialYear", { date });

// ─────────────────────────────────────────────────────────────────────────────
// Automation — Penalty & Scheduler
// ─────────────────────────────────────────────────────────────────────────────
export const triggerPenaltyApi = async (runDate = null) =>
    billingPost("TriggerPenalty", { run_date: runDate });

export const getPenaltyHistoryApi = async (filters = {}) =>
    billingPost("GetPenaltyHistory", {
        flat_id:   filters.flat_id   ? parseInt(filters.flat_id)   : null,
        bill_id:   filters.bill_id   ? parseInt(filters.bill_id)   : null,
        page:      filters.page      ? parseInt(filters.page)      : 1,
        page_size: filters.page_size ? parseInt(filters.page_size) : 20,
    });

export const triggerAutoBillGenerationApi = async (runDate = null) =>
    billingPost("TriggerAutoBillGeneration", { run_date: runDate });

export const getSchedulerLogsApi = async (page = 1, pageSize = 20, jobType = null) =>
    billingPost("GetSchedulerLogs", { page, page_size: pageSize, job_type: jobType });

// ─────────────────────────────────────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────────────────────────────────────
export const getCollectionReportApi = async (filters = {}) =>
    billingPost("GetCollectionReport", {
        from_date: filters.from_date || null,
        to_date:   filters.to_date   || null,
        page:      filters.page      ? parseInt(filters.page)      : 1,
        page_size: filters.page_size ? parseInt(filters.page_size) : 20,
    });

export const getMemberOutstandingApi = async (filters = {}) =>
    billingPost("GetMemberOutstanding", {
        as_of_date: filters.as_of_date || null,
        flat_id:    filters.flat_id    ? parseInt(filters.flat_id) : null,
        page:       filters.page       ? parseInt(filters.page)    : 1,
        page_size:  filters.page_size  ? parseInt(filters.page_size): 20,
    });

export const getIncomeExpenditureApi = async (filters = {}) =>
    billingPost("GetIncomeExpenditure", {
        fy_start: filters.fy_start || null,
        fy_end:   filters.fy_end   || null,
    });

export const getCashBookApi = async (filters = {}) =>
    billingPost("GetCashBook", {
        from_date: filters.from_date || null,
        to_date:   filters.to_date   || null,
        mode:      filters.mode      || null,
    });

export const getBillingSummaryByFYApi = async (fyStart = null, fyEnd = null) =>
    billingPost("GetBillingSummaryByFY", { fy_start: fyStart, fy_end: fyEnd });

// Scheduler progress
export const recalcBillItemsApi  = async (billId) => billingPost("RecalcBillItems", { bill_id: parseInt(billId) });
export const recalcFlatBillsApi = async (data) => billingPost("RecalcFlatBills", data);

export const waiveOffApi            = async (data) => billingPost("WaiveOff", data);
export const getWaiveOffHistoryApi  = async (data={}) => billingPost("GetWaiveOffHistory", data);

export const triggerInterestApi      = async (data={}) => billingPost("TriggerInterest", data);
export const getInterestHistoryApi   = async (data={}) => billingPost("GetInterestHistory", data);

export const getSchedulerProgressApi = async () =>
    billingPost("GetSchedulerProgress", {});
