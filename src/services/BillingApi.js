import apiClient from "./ApiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

// ─── Billing Settings ────────────────────────────────────────────────────────

export const upsertBillingSettingsApi = async (data) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/UpsertBillingSettings",
        data,
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const getBillingSettingsApi = async () => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/GetBillingSettings",
        data: {},
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

// ─── Charge Heads ────────────────────────────────────────────────────────────

export const upsertChargeHeadApi = async (data) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/UpsertChargeHead",
        data,
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const deleteChargeHeadApi = async (headId) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/DeleteChargeHead",
        data: { head_id: headId },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const listChargeHeadsApi = async (appliesTo = "") => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/ListChargeHeads",
        data: { applies_to: appliesTo },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const autoApplyChargeHeadApi = async (headId) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/AutoApplyChargeHead",
        data: { head_id: headId },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

// ─── Flat Charge Config ───────────────────────────────────────────────────────

export const setFlatChargeConfigApi = async (data) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/SetFlatChargeConfig",
        data,
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const getFlatChargeConfigApi = async (flatId) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/GetFlatChargeConfig",
        data: { flat_id: flatId },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const overrideFlatChargeApi = async (data) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/OverrideFlatCharge",
        data,
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const resetFlatChargeOverrideApi = async (flatId, headId) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/ResetFlatChargeOverride",
        data: { flat_id: flatId, head_id: headId },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const listFlatChargeConfigsApi = async (filters = {}) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/ListFlatChargeConfigs",
        data: {
            head_id: filters.headId || null,
            property_type: filters.propertyType || "",
            is_override: filters.isOverride ?? null,
            page: filters.page || 1,
            page_size: filters.pageSize || 20,
        },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

// ─── Opening Balance ──────────────────────────────────────────────────────────

export const setOpeningBalanceApi = async (data) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/SetOpeningBalance",
        data,
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

// ─── Bills ────────────────────────────────────────────────────────────────────

export const generateBillApi = async (data) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/GenerateBill",
        data,
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const getBillApi = async (billId) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/GetBill",
        data: { bill_id: billId },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const listBillsApi = async (filters = {}) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/ListBills",
        data: {
            flat_id: filters.flatId || null,
            status: filters.status || "",
            bill_month: filters.billMonth || "",
            bill_year: filters.billYear || null,
            overdue_only: filters.overdueOnly || 0,
            page: filters.page || 1,
            page_size: filters.pageSize || 10,
        },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const recordPaymentApi = async (data) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/RecordPayment",
        data,
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

// ─── Ledger & Summary ─────────────────────────────────────────────────────────

export const getFlatLedgerApi = async (flatId, fromYear = null, toYear = null) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/GetFlatLedger",
        data: { flat_id: flatId, from_year: fromYear, to_year: toYear },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};

export const getBillingSummaryApi = async (billMonth = "", billYear = null) => {
    return await apiClient({
        method: "post",
        url: UrlData + "billing/GetBillingSummary",
        data: { bill_month: billMonth, bill_year: billYear },
        timeout: 30000,
    }).then((r) => r.data.data).catch((e) => { throw ErrorHandler(e); });
};
