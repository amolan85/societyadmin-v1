// import apiClient from "./ApiClient";
// import ErrorHandler from "../utils/ErrorHandler";
// import UrlData from "../utils/Url";
// import { GetSessionData } from "../utils/SessionManagement";

// // ─────────────────────────────────────────────────────────────────────────────
// // Get society_id from session
// // ─────────────────────────────────────────────────────────────────────────────
// const getSocietyId = () => {
//     const s = GetSessionData();
//     // Session structure: { data: { flats: [{ society_id }] } }
//     return s?.data?.flats?.[0]?.society_id
//         || s?.data?.society_id
//         || s?.society_id
//         || null;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // POST JSON helper — injects society_id into every request body
// // ─────────────────────────────────────────────────────────────────────────────
// const billingPost = async (endpoint, payload = {}, timeout = 30000) => {
//     try {
//         const response = await apiClient({
//             method:  "post",
//             url:     UrlData + "billing/" + endpoint,
//             data:    { society_id: getSocietyId(), ...payload },
//             timeout,
//         });
//         return response.data.data;
//     } catch (error) {
//         throw ErrorHandler(error);
//     }
// };


// // ─────────────────────────────────────────────────────────────────────────────
// // Billing Settings
// // ─────────────────────────────────────────────────────────────────────────────

// export const upsertBillingSettingsApi = async (data) =>
//     billingPost("UpsertBillingSettings", {
//         financial_year:   data.financial_year   || null,
//         fy_start_date:    data.fy_start_date    || null,
//         fy_end_date:      data.fy_end_date      || null,
//         interest_rate:    data.interest_rate    != null ? parseFloat(data.interest_rate)  : null,
//         interest_type:    data.interest_type    || null,
//         due_day:          data.due_day          != null ? parseInt(data.due_day)          : null,
//         roundoff:         data.roundoff         != null ? parseInt(data.roundoff)         : null,
//         startup_month:    data.startup_month    || null,
//         startup_bill_no:  data.startup_bill_no  != null ? parseInt(data.startup_bill_no) : null,
//         bill_type:        data.bill_type        || null,
//         notes:            data.notes            || null,
//         additional_notes: data.additional_notes || null,
//     });

// export const getBillingSettingsApi = async () =>
//     billingPost("GetBillingSettings", {});


// // ─────────────────────────────────────────────────────────────────────────────
// // Charge Heads
// // ─────────────────────────────────────────────────────────────────────────────

// export const upsertChargeHeadApi = async (data) =>
//     billingPost("UpsertChargeHead", {
//         head_id:            data.head_id            ? parseInt(data.head_id)                      : null,
//         head_code:          data.head_code          || null,
//         head_name:          data.head_name          || null,
//         head_group:         data.head_group         || null,
//         charge_type:        data.charge_type        || "fixed",
//         charge_scope:       data.charge_scope       || "centralised",
//         centralised_amount: data.centralised_amount != null ? parseFloat(data.centralised_amount) : null,
//         centralised_rate:   data.centralised_rate   != null ? parseFloat(data.centralised_rate)   : null,
//         applies_to_types:   data.applies_to_types   || null,
//         is_active:          data.is_active          != null ? parseInt(data.is_active)            : null,
//         sort_order:         data.sort_order         != null ? parseInt(data.sort_order)           : null,
//     });

// export const deleteChargeHeadApi = async (headId) =>
//     billingPost("DeleteChargeHead", {
//         head_id: parseInt(headId),
//     });

// export const listChargeHeadsApi = async (appliesTo = "") =>
//     billingPost("ListChargeHeads", {
//         applies_to: appliesTo || "",
//     });

// export const autoApplyChargeHeadApi = async (headId) =>
//     billingPost("AutoApplyChargeHead", {
//         head_id: parseInt(headId),
//     });


// // ─────────────────────────────────────────────────────────────────────────────
// // Flat Charge Config
// // ─────────────────────────────────────────────────────────────────────────────

// export const setFlatChargeConfigApi = async (data) =>
//     billingPost("SetFlatChargeConfig", {
//         flat_id:        parseInt(data.flat_id),
//         head_id:        parseInt(data.head_id),
//         amount:         parseFloat(data.amount),
//         effective_from: data.effective_from || null,
//         effective_to:   data.effective_to   || null,
//     });

// export const getFlatChargeConfigApi = async (flatId) =>
//     billingPost("GetFlatChargeConfig", {
//         flat_id: parseInt(flatId),
//     });

// export const overrideFlatChargeApi = async (data) =>
//     billingPost("OverrideFlatCharge", {
//         flat_id:        parseInt(data.flat_id),
//         head_id:        parseInt(data.head_id),
//         charge_type:    data.charge_type    || "fixed",
//         amount:         data.amount         != null ? parseFloat(data.amount)        : null,
//         rate_per_sqft:  data.rate_per_sqft  != null ? parseFloat(data.rate_per_sqft) : null,
//         effective_from: data.effective_from || null,
//         effective_to:   data.effective_to   || null,
//     });

// export const resetFlatChargeOverrideApi = async (flatId, headId) =>
//     billingPost("ResetFlatChargeOverride", {
//         flat_id: parseInt(flatId),
//         head_id: parseInt(headId),
//     });

// // export const listFlatChargeConfigsApi = async (filters = {}) =>
// //     billingPost("ListFlatChargeConfigs", {
// //         head_id:       filters.headId       ? parseInt(filters.headId)             : null,
// //         property_type: filters.propertyType || "",
// //         is_override:   filters.isOverride   != null ? parseInt(filters.isOverride) : null,
// //         page:          filters.page         ? parseInt(filters.page)               : 1,
// //         page_size:     filters.pageSize     ? parseInt(filters.pageSize)           : 20,
// //     });


// // ─────────────────────────────────────────────────────────────────────────────
// // Opening Balance
// // ─────────────────────────────────────────────────────────────────────────────

// export const setOpeningBalanceApi = async (data) =>
//     billingPost("SetOpeningBalance", {
//         flat_id:    parseInt(data.flat_id),
//         as_of_date: data.as_of_date,
//         principal:  data.principal != null ? parseFloat(data.principal) : 0,
//         interest:   data.interest  != null ? parseFloat(data.interest)  : 0,
//         remarks:    data.remarks   || null,
//     });


// // ─────────────────────────────────────────────────────────────────────────────
// // Bills
// // ─────────────────────────────────────────────────────────────────────────────

// export const generateBillApi = async (data) =>
//     billingPost("GenerateBill", {
//         flat_id:    parseInt(data.flat_id),
//         bill_month: data.bill_month,
//         bill_year:  parseInt(data.bill_year),
//         bill_date:  data.bill_date || null,
//         due_date:   data.due_date  || null,
//     }, 60000);

// export const generateBillsForAllApi = async (billMonth, billYear, billDate = null, dueDate = null) =>
//     billingPost("GenerateBillsForAll", {
//         bill_month: billMonth,
//         bill_year:  parseInt(billYear),
//         bill_date:  billDate || null,
//         due_date:   dueDate  || null,
//     }, 120000);

// export const getBillApi = async (billId) =>
//     billingPost("GetBill", {
//         bill_id: parseInt(billId),
//     });

// export const listBillsApi = async (filters = {}) =>
//     billingPost("ListBills", {
//         flat_id:      filters.flatId      ? parseInt(filters.flatId)      : null,
//         status:       filters.status      || "",
//         bill_month:   filters.billMonth   || "",
//         bill_year:    filters.billYear    ? parseInt(filters.billYear)    : null,
//         overdue_only: filters.overdueOnly ? parseInt(filters.overdueOnly) : 0,
//         page:         filters.page        ? parseInt(filters.page)        : 1,
//         page_size:    filters.pageSize    ? parseInt(filters.pageSize)    : 10,
//     });


// // ─────────────────────────────────────────────────────────────────────────────
// // Payments
// // ─────────────────────────────────────────────────────────────────────────────

// export const recordPaymentApi = async (data) =>
//     billingPost("RecordPayment", {
//         flat_id:          parseInt(data.flat_id),
//         bill_id:          data.bill_id         ? parseInt(data.bill_id)             : null,
//         bill_month:       data.bill_month       || null,
//         bill_year:        data.bill_year        ? parseInt(data.bill_year)          : null,
//         receipt_date:     data.receipt_date     || null,
//         principal_amount: data.principal_amount ? parseFloat(data.principal_amount) : null,
//         interest_amount:  data.interest_amount  ? parseFloat(data.interest_amount)  : null,
//         payment_mode:     data.payment_mode,
//         bank_name:        data.bank_name        || null,
//         branch:           data.branch           || null,
//         cheque_no:        data.cheque_no        || null,
//         transaction_ref:  data.transaction_ref  || null,
//         narration:        data.narration        || null,
//     });


// // ─────────────────────────────────────────────────────────────────────────────
// // Ledger & Summary
// // ─────────────────────────────────────────────────────────────────────────────

// export const getFlatLedgerApi = async (flatId, fromYear = null, toYear = null) =>
//     billingPost("GetFlatLedger", {
//         flat_id:   parseInt(flatId),
//         from_year: fromYear ? parseInt(fromYear) : null,
//         to_year:   toYear   ? parseInt(toYear)   : null,
//     });

// export const getBillingSummaryApi = async (billMonth = "", billYear = null) =>
//     billingPost("GetBillingSummary", {
//         bill_month: billMonth || "",
//         bill_year:  billYear  ? parseInt(billYear) : null,
//     });


// // ─────────────────────────────────────────────────────────────────────────────
// // Flat Charges — Individual Add / Remove
// // ─────────────────────────────────────────────────────────────────────────────

// export const addFlatChargeApi = async (data) =>
//     billingPost("AddFlatCharge", {
//         flat_id:        parseInt(data.flat_id),
//         head_id:        parseInt(data.head_id),
//         charge_type:    data.charge_type    || "fixed",
//         amount:         data.amount         != null ? parseFloat(data.amount)        : null,
//         rate_per_sqft:  data.rate_per_sqft  != null ? parseFloat(data.rate_per_sqft) : null,
//         effective_from: data.effective_from || null,
//         effective_to:   data.effective_to   || null,
//     });

// export const removeFlatChargeApi = async (flatId, headId) =>
//     billingPost("RemoveFlatCharge", {
//         flat_id: parseInt(flatId),
//         head_id: parseInt(headId),
//     });

// // Updated listFlatChargeConfigsApi with new filters (search + flat_id)
// export const listFlatChargeConfigsApi = async (filters = {}) =>
//     billingPost("ListFlatChargeConfigs", {
//         head_id:       filters.headId       ? parseInt(filters.headId)             : null,
//         property_type: filters.propertyType || "",
//         flat_id:       filters.flatId       ? parseInt(filters.flatId)             : null,
//         is_override:   filters.isOverride   != null ? parseInt(filters.isOverride) : null,
//         search:        filters.search       || "",
//         page:          filters.page         ? parseInt(filters.page)               : 1,
//         page_size:     filters.pageSize     ? parseInt(filters.pageSize)           : 20,
//     });

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
        financial_year:   data.financial_year   || null,
        fy_start_date:    data.fy_start_date    || null,
        fy_end_date:      data.fy_end_date      || null,
        interest_rate:    data.interest_rate    != null ? parseFloat(data.interest_rate)   : null,
        interest_type:    data.interest_type    || null,
        due_day:          data.due_day          != null ? parseInt(data.due_day)           : null,
        roundoff:         data.roundoff         != null ? parseInt(data.roundoff)          : null,
        startup_month:    data.startup_month    || null,
        startup_bill_no:  data.startup_bill_no  != null ? parseInt(data.startup_bill_no)  : null,
        bill_type:        data.bill_type        || null,
        notes:            data.notes            || null,
        additional_notes: data.additional_notes || null,
    });

export const getBillingSettingsApi = async () => billingPost("GetBillingSettings", {});

// ── Charge Heads ──────────────────────────────────────────────────────────────
export const upsertChargeHeadApi = async (data) =>
    billingPost("UpsertChargeHead", {
        head_id:            data.head_id            ? parseInt(data.head_id)                      : null,
        head_code:          data.head_code          || null,
        head_name:          data.head_name          || null,
        head_group:         data.head_group         || null,
        charge_type:        data.charge_type        || "fixed",
        charge_scope:       data.charge_scope       || "centralised",
        centralised_amount: data.centralised_amount != null ? parseFloat(data.centralised_amount) : null,
        centralised_rate:   data.centralised_rate   != null ? parseFloat(data.centralised_rate)   : null,
        applies_to_types:   data.applies_to_types   || null,
        is_active:          data.is_active          != null ? parseInt(data.is_active)            : null,
        sort_order:         data.sort_order         != null ? parseInt(data.sort_order)           : null,
    });

export const deleteChargeHeadApi    = async (headId)     => billingPost("DeleteChargeHead",    { head_id: parseInt(headId) });
export const listChargeHeadsApi     = async (appliesTo="")=> billingPost("ListChargeHeads",     { applies_to: appliesTo || "" });
export const autoApplyChargeHeadApi = async (headId)     => billingPost("AutoApplyChargeHead", { head_id: parseInt(headId) });

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
        flat_id: parseInt(data.flat_id), head_id: parseInt(data.head_id),
        charge_type:   data.charge_type   || "fixed",
        amount:        data.amount        != null ? parseFloat(data.amount)        : null,
        rate_per_sqft: data.rate_per_sqft != null ? parseFloat(data.rate_per_sqft) : null,
        effective_from: data.effective_from || null, effective_to: data.effective_to || null,
    });

export const removeFlatChargeApi = async (flatId, headId) =>
    billingPost("RemoveFlatCharge", { flat_id: parseInt(flatId), head_id: parseInt(headId) });

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
export const creditWalletApi = async (flatId, amount, txnSource = "payment", narration = null) =>
    billingPost("CreditWallet", {
        flat_id:    parseInt(flatId),
        amount:     parseFloat(amount),
        txn_source: txnSource || "payment",
        narration:  narration || null,
    });

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