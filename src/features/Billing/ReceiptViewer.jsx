import { useState } from "react";
import { toast } from "react-toastify";
import { resendReceiptApi } from "../../services/BillingApi";

const fmt  = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const fmtD = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

const ReceiptViewer = ({ receipt, bill, society = {}, onClose }) => {
    const [sending, setSending] = useState("");

    const soc = {
        name:    society.name    || "Society Management",
        address: society.address || "",
        city:    society.city    || "",
        state:   society.state   || "",
        reg:     society.registration_number || "",
    };

    const isWalletOnly = (receipt?.receipt_no || "").startsWith("WALLET-");
    const flatLabel    = `Flat ${bill?.flat_number || ""}${bill?.block ? " / "+bill.block : ""}${bill?.floor ? " · Floor "+bill.floor : ""}`;
    const ownerName    = (bill?.owner_name || receipt?.owner_name || "").trim() || "—";
    const ownerMob     = bill?.owner_mobile  || receipt?.owner_mobile  || "—";
    const ownerEmail   = bill?.owner_email   || receipt?.owner_email   || "—";
    const rcptNo       = receipt?.receipt_no || "—";
    const rcptDate     = fmtD(receipt?.receipt_date || new Date().toISOString());
    const billPeriod   = `${bill?.bill_month || receipt?.bill_month || ""} ${bill?.bill_year || receipt?.bill_year || ""}`;
    const billNo       = bill?.bill_no || receipt?.bill_no || "—";
    const payMode      = (receipt?.payment_mode || "").toUpperCase();
    const bankName     = receipt?.bank_name || "";
    const txnRef       = receipt?.transaction_ref || receipt?.cheque_no || "";
    const narration    = receipt?.narration || "";
    const walletAmt    = parseFloat(receipt?.wallet_applied  || 0);
    const principal    = parseFloat(receipt?.principal_amount || 0);
    const interest     = parseFloat(receipt?.interest_amount  || 0);
    const total        = parseFloat(receipt?.total_amount     || principal + interest + walletAmt);
    const balPrin      = parseFloat(receipt?.balance_principal || bill?.balance_principal || 0);
    const balInt       = parseFloat(receipt?.balance_interest  || bill?.balance_interest  || 0);
    const balTotal     = balPrin + balInt;
    const isFullyPaid  = balTotal <= 0;

    // Bill charge items
    const items        = bill?.items || [];
    const charges      = parseFloat(bill?.current_charges    || 0);
    const openPrin     = parseFloat(bill?.opening_principal  || 0);
    const openInt      = parseFloat(bill?.opening_interest   || 0);
    const intCharged   = parseFloat(bill?.interest_charged   || 0);
    const billTotal    = parseFloat(bill?.total_amount       || charges);

    // ── Build receipt HTML for print/download ──────────────────
    const buildReceiptHTML = () => `<!DOCTYPE html><html><head>
<title>Receipt ${rcptNo}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Arial,sans-serif; color:#111; background:#f5f5f5; padding:20px; }
  .page { max-width:680px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,.1); }
  .header { background:linear-gradient(135deg,#1e40af,#3b82f6); color:#fff; padding:28px 32px; }
  .header h1 { font-size:22px; margin-bottom:4px; }
  .header p  { font-size:12px; opacity:.8; }
  .badge { display:inline-block; background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.4); padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; margin-top:10px; letter-spacing:1px; }
  .receipt-no { float:right; text-align:right; }
  .receipt-no .num { font-size:18px; font-weight:800; }
  .receipt-no .lbl { font-size:10px; opacity:.7; }
  .body { padding:24px 32px; }
  .section { margin-bottom:20px; }
  .section-title { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #f3f4f6; }
  .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .meta-box { background:#f9fafb; padding:10px 14px; border-radius:8px; }
  .meta-box .label { font-size:10px; color:#9ca3af; margin-bottom:2px; }
  .meta-box .value { font-size:13px; font-weight:700; color:#111; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { background:#f3f4f6; padding:9px 12px; text-align:left; font-size:11px; color:#6b7280; font-weight:700; }
  td { padding:9px 12px; border-bottom:1px solid #f9fafb; }
  td.amt { text-align:right; font-weight:600; }
  .subtotal { background:#f9fafb; }
  .subtotal td { font-weight:700; padding:10px 12px; }
  .total-row { background:#1e40af; color:#fff; }
  .total-row td { padding:12px; font-weight:800; font-size:15px; }
  .total-row td.amt { color:#fff; }
  .status-box { border-radius:8px; padding:12px 16px; text-align:center; margin-top:16px; }
  .status-box.paid { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }
  .status-box.due  { background:#fff7ed; color:#92400e; border:1px solid #fde68a; }
  .footer { border-top:1px solid #f3f4f6; padding:14px 32px; text-align:center; font-size:10px; color:#9ca3af; background:#fafafa; }
  @media print { body { background:#fff; padding:0; } .page { box-shadow:none; } }
</style>
</head><body>
<div class="page">
  <div class="header">
    <div class="receipt-no">
      <div class="lbl">RECEIPT NO.</div>
      <div class="num">${rcptNo}</div>
      <div style="font-size:11px;opacity:.8;margin-top:2px">${rcptDate}</div>
    </div>
    <h1>${soc.name}</h1>
    <p>${[soc.address, soc.city, soc.state].filter(Boolean).join(", ")}</p>
    ${soc.reg ? `<p style="margin-top:2px">Reg: ${soc.reg}</p>` : ""}
    <div class="badge">PAYMENT RECEIPT</div>
  </div>

  <div class="body">

    <!-- Flat & Member Info -->
    <div class="section">
      <div class="section-title">Member Details</div>
      <div class="meta-grid">
        <div class="meta-box"><div class="label">Flat</div><div class="value">${flatLabel}</div></div>
        <div class="meta-box"><div class="label">Bill No.</div><div class="value">${billNo}</div></div>
        <div class="meta-box"><div class="label">Owner Name</div><div class="value">${ownerName}</div></div>
        <div class="meta-box"><div class="label">Bill Period</div><div class="value">${billPeriod}</div></div>
        ${ownerMob !== "—" ? `<div class="meta-box"><div class="label">Mobile</div><div class="value">${ownerMob}</div></div>` : ""}
        ${ownerEmail !== "—" ? `<div class="meta-box"><div class="label">Email</div><div class="value" style="font-size:11px">${ownerEmail}</div></div>` : ""}
      </div>
    </div>

    <!-- Bill Bifurcation -->
    ${items.length > 0 ? `
    <div class="section">
      <div class="section-title">Bill Charge Breakdown</div>
      <table>
        <thead><tr><th>Charge Head</th><th>Code</th><th>Type</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          ${items.map(it => `<tr>
            <td>${it.head_name || "—"}</td>
            <td style="color:#6b7280;font-size:11px">${it.head_code || ""}</td>
            <td style="font-size:11px;text-transform:capitalize">${it.charge_type || ""}</td>
            <td class="amt">${fmt(it.amount)}</td>
          </tr>`).join("")}
          ${openPrin > 0 ? `<tr><td colspan="3" style="color:#dc2626">Opening Principal (Arrear)</td><td class="amt" style="color:#dc2626">${fmt(openPrin)}</td></tr>` : ""}
          ${openInt > 0  ? `<tr><td colspan="3" style="color:#dc2626">Opening Interest</td><td class="amt" style="color:#dc2626">${fmt(openInt)}</td></tr>` : ""}
          ${intCharged > 0 ? `<tr><td colspan="3" style="color:#dc2626">Interest Charged (${bill?.interest_type === "C" ? "Compound" : "Simple"})</td><td class="amt" style="color:#dc2626">${fmt(intCharged)}</td></tr>` : ""}
          <tr class="subtotal"><td colspan="3">Total Bill Amount</td><td class="amt">${fmt(billTotal)}</td></tr>
        </tbody>
      </table>
    </div>` : ""}

    <!-- Payment Details -->
    <div class="section">
      <div class="section-title">Payment Details</div>
      <table>
        <thead><tr><th colspan="2">This Payment</th></tr></thead>
        <tbody>
          <tr><td style="color:#6b7280">Date</td><td style="font-weight:600">${rcptDate}</td></tr>
          <tr><td style="color:#6b7280">Payment Mode</td><td style="font-weight:700">${payMode || "WALLET"}</td></tr>
          ${bankName ? `<tr><td style="color:#6b7280">Bank</td><td>${bankName}</td></tr>` : ""}
          ${txnRef ? `<tr><td style="color:#6b7280">Reference</td><td>${txnRef}</td></tr>` : ""}
          ${narration ? `<tr><td style="color:#6b7280">Narration</td><td>${narration}</td></tr>` : ""}
        </tbody>
      </table>
    </div>

    <!-- Amount Summary -->
    <div class="section">
      <div class="section-title">Amount Summary</div>
      <table>
        <tbody>
          ${principal > 0 ? `<tr><td>Principal Received</td><td class="amt">${fmt(principal)}</td></tr>` : ""}
          ${interest  > 0 ? `<tr><td style="color:#dc2626">Interest Received</td><td class="amt" style="color:#dc2626">${fmt(interest)}</td></tr>` : ""}
          ${walletAmt > 0 ? `<tr><td style="color:#7c3aed">💜 Wallet Applied</td><td class="amt" style="color:#7c3aed">${fmt(walletAmt)}</td></tr>` : ""}
          <tr class="total-row"><td>TOTAL AMOUNT RECEIVED</td><td class="amt">${fmt(total)}</td></tr>
        </tbody>
      </table>

      <div class="status-box ${isFullyPaid ? "paid" : "due"}">
        ${isFullyPaid
            ? "✅ This bill is FULLY PAID. Thank you for your payment!"
            : `⚠️ Balance Remaining: ${fmt(balTotal)} — Please pay at the earliest.`}
      </div>
    </div>

  </div>
  <div class="footer">
    Computer generated receipt · ${soc.name} · Generated: ${new Date().toLocaleString("en-IN",{hour12:true})}
  </div>
</div>
</body></html>`;

    // ── Actions ────────────────────────────────────────────────
    const handleEmail = async () => {
        if (isWalletOnly) { toast.info("Use WhatsApp or Print for wallet receipts"); return; }
        const id = receipt?.receipt_id || receipt?.id;
        if (!id) { toast.error("No receipt ID found"); return; }
        setSending("email");
        try {
            await resendReceiptApi(id);
            toast.success(`Receipt emailed to ${ownerEmail} ✅`);
        } catch (e) {
            toast.error(typeof e === "string" ? e : "Email failed");
        } finally { setSending(""); }
    };

    const handleWhatsApp = () => {
        const mobile = (ownerMob || "").replace(/\D/g,"");
        if (!mobile || mobile.length < 10) { toast.error("No mobile number found"); return; }
        const msg = encodeURIComponent(
            `🏢 *${soc.name}*\n━━━━━━━━━━━━━━\n` +
            `✅ *Payment Receipt*\n\n` +
            `📄 Receipt: *${rcptNo}*\n🏠 Flat: *${flatLabel}*\n👤 ${ownerName}\n` +
            `📅 Period: *${billPeriod}*\n📆 Date: ${rcptDate}\n` +
            `💳 Mode: ${payMode || "WALLET"}${txnRef ? ` (${txnRef})` : ""}\n\n` +
            `💰 Paid: *${fmt(total)}*\n` +
            (walletAmt > 0 ? `💜 Wallet: ${fmt(walletAmt)}\n` : "") +
            (items.length > 0 ? `\n📋 *Charges:*\n${items.map(it=>`  • ${it.head_name}: ${fmt(it.amount)}`).join("\n")}\n` : "") +
            `\n${isFullyPaid ? "✅ *Bill Fully Paid*" : `⚠️ Balance: ${fmt(balTotal)}`}\n━━━━━━━━━━━━━━\nThank you! 🙏`
        );
        window.open(`https://wa.me/91${mobile}?text=${msg}`, "_blank");
    };

    const handlePrint = () => {
        const w = window.open("","_blank","width=800,height=950");
        w.document.write(buildReceiptHTML());
        w.document.close();
        setTimeout(() => w.print(), 500);
    };

    const handleDownload = () => {
        const b64 = receipt?.pdf_base64;
        if (b64 && b64.length > 100) {
            // Real PDF from server
            const a    = document.createElement("a");
            a.href     = `data:application/pdf;base64,${b64}`;
            a.download = receipt.pdf_filename || `Receipt_${rcptNo}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            // Fallback: HTML receipt download
            const html = buildReceiptHTML();
            const blob = new Blob([html], { type:"text/html;charset=utf-8" });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href     = url;
            a.download = `Receipt_${rcptNo}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handlePreviewPDF = () => {
        const b64 = receipt?.pdf_base64;
        if (b64 && b64.length > 100) {
            // Open PDF in new tab
            const byteChars = atob(b64);
            const byteNums  = new Array(byteChars.length).fill(0).map((_,i) => byteChars.charCodeAt(i));
            const byteArr   = new Uint8Array(byteNums);
            const blob      = new Blob([byteArr], { type:"application/pdf" });
            const url       = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } else {
            handlePrint();
        }
    };

    return (
        <div className="modal show d-block" style={{ background:"rgba(0,0,0,0.65)", zIndex:9999 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth:580 }}>
                <div className="modal-content" style={{ borderRadius:16, border:"none", overflow:"hidden", maxHeight:"92vh" }}>

                    {/* Header */}
                    <div style={{ background:"linear-gradient(135deg,#059669,#10b981)", padding:"22px 24px 18px", color:"#fff" }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div style={{ fontSize:12, opacity:.8 }}>Payment Receipt · {rcptDate}</div>
                                <div style={{ fontSize:21, fontWeight:800, marginTop:2 }}>✅ Payment Received</div>
                                <div style={{ fontSize:13, opacity:.85, marginTop:2 }}>
                                    Receipt #{rcptNo} · {billPeriod}
                                </div>
                            </div>
                            <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", width:30, height:30, borderRadius:"50%", fontSize:18, cursor:"pointer" }}>×</button>
                        </div>
                        <div style={{ marginTop:12, fontSize:30, fontWeight:800 }}>{fmt(total)}</div>
                        <div style={{ fontSize:13, opacity:.85 }}>{flatLabel}</div>
                    </div>

                    <div style={{ overflowY:"auto", maxHeight:"calc(92vh - 220px)" }}>

                        {/* Bill bifurcation */}
                        {items.length > 0 && (
                            <div style={{ margin:"16px 20px 0", background:"#f9fafb", borderRadius:10, overflow:"hidden" }}>
                                <div style={{ padding:"10px 14px", background:"#f3f4f6", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:1 }}>
                                    📋 Bill Charge Breakdown
                                </div>
                                {items.map((it, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center"
                                        style={{ padding:"8px 14px", borderBottom:"1px solid #f0f0f0", fontSize:13 }}>
                                        <div>
                                            <span style={{ fontWeight:600 }}>{it.head_name}</span>
                                            <span style={{ fontSize:11, color:"#9ca3af", marginLeft:6 }}>({it.head_code})</span>
                                        </div>
                                        <span style={{ fontWeight:700 }}>{fmt(it.amount)}</span>
                                    </div>
                                ))}
                                {openPrin > 0 && (
                                    <div className="d-flex justify-content-between" style={{ padding:"8px 14px", borderBottom:"1px solid #f0f0f0", fontSize:13 }}>
                                        <span style={{ color:"#dc2626" }}>Opening Arrear</span>
                                        <span style={{ fontWeight:700, color:"#dc2626" }}>{fmt(openPrin)}</span>
                                    </div>
                                )}
                                {intCharged > 0 && (
                                    <div className="d-flex justify-content-between" style={{ padding:"8px 14px", borderBottom:"1px solid #f0f0f0", fontSize:13 }}>
                                        <span style={{ color:"#dc2626" }}>Interest Charged</span>
                                        <span style={{ fontWeight:700, color:"#dc2626" }}>{fmt(intCharged)}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between" style={{ padding:"10px 14px", background:"#e5e7eb", fontSize:13 }}>
                                    <span style={{ fontWeight:700 }}>Total Bill</span>
                                    <span style={{ fontWeight:800 }}>{fmt(billTotal)}</span>
                                </div>
                            </div>
                        )}

                        {/* Payment summary */}
                        <div style={{ margin:"12px 20px 0", background:"#f9fafb", borderRadius:10, overflow:"hidden" }}>
                            <div style={{ padding:"10px 14px", background:"#f3f4f6", fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:1 }}>
                                💳 This Payment
                            </div>
                            {[
                                { label:"Owner",         val: ownerName },
                                { label:"Bill Period",   val: billPeriod },
                                { label:"Payment Mode",  val: payMode || "WALLET" },
                                ...(bankName  ? [{ label:"Bank",      val: bankName }]  : []),
                                ...(txnRef    ? [{ label:"Txn Ref",   val: txnRef }]    : []),
                                ...(narration ? [{ label:"Narration", val: narration }] : []),
                            ].map((r,i,arr) => (
                                <div key={i} className="d-flex justify-content-between"
                                    style={{ padding:"8px 14px", borderBottom:i<arr.length-1?"1px solid #f0f0f0":"none", fontSize:13 }}>
                                    <span style={{ color:"#6b7280" }}>{r.label}</span>
                                    <span style={{ fontWeight:600 }}>{r.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Amount breakdown */}
                        <div style={{ margin:"12px 20px 0", background:"#f9fafb", borderRadius:10, overflow:"hidden" }}>
                            {principal > 0 && (
                                <div className="d-flex justify-content-between" style={{ padding:"8px 14px", borderBottom:"1px solid #f0f0f0", fontSize:13 }}>
                                    <span style={{ color:"#6b7280" }}>Principal</span>
                                    <span style={{ fontWeight:600 }}>{fmt(principal)}</span>
                                </div>
                            )}
                            {interest > 0 && (
                                <div className="d-flex justify-content-between" style={{ padding:"8px 14px", borderBottom:"1px solid #f0f0f0", fontSize:13 }}>
                                    <span style={{ color:"#dc2626" }}>Interest</span>
                                    <span style={{ fontWeight:600, color:"#dc2626" }}>{fmt(interest)}</span>
                                </div>
                            )}
                            {walletAmt > 0 && (
                                <div className="d-flex justify-content-between" style={{ padding:"8px 14px", borderBottom:"1px solid #f0f0f0", fontSize:13 }}>
                                    <span style={{ color:"#7c3aed" }}>💜 Wallet</span>
                                    <span style={{ fontWeight:600, color:"#7c3aed" }}>{fmt(walletAmt)}</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between"
                                style={{ padding:"11px 14px", background:"#059669", fontSize:15 }}>
                                <span style={{ color:"#fff", fontWeight:700 }}>Total Received</span>
                                <span style={{ color:"#fff", fontWeight:800 }}>{fmt(total)}</span>
                            </div>
                        </div>

                        {/* Balance status */}
                        <div style={{ margin:"12px 20px", borderRadius:10, padding:"11px 14px", textAlign:"center",
                            background:isFullyPaid?"#d1fae5":"#fff7ed",
                            border:`1px solid ${isFullyPaid?"#6ee7b7":"#fde68a"}` }}>
                            {isFullyPaid
                                ? <span style={{ color:"#065f46", fontWeight:700 }}>✅ Bill Fully Paid — No Balance Due</span>
                                : <span style={{ color:"#92400e", fontWeight:700 }}>⚠️ Balance Remaining: {fmt(balTotal)}</span>}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ padding:"12px 20px 20px", borderTop:"1px solid #f3f4f6" }}>
                        <div style={{ fontSize:11, color:"#6b7280", fontWeight:600, marginBottom:8 }}>Share / Download:</div>
                        <div className="d-flex gap-2 mb-2">
                            <button onClick={handleEmail} disabled={!!sending}
                                style={{ flex:1, padding:"10px 0", borderRadius:8, border:"none", cursor:"pointer",
                                    background:"#2563eb", color:"#fff", fontWeight:600, fontSize:13,
                                    opacity:sending?"0.7":"1" }}>
                                {sending ? "⏳..." : "📧 Email"}
                            </button>
                            <button onClick={handleWhatsApp}
                                style={{ flex:1, padding:"10px 0", borderRadius:8, border:"none", cursor:"pointer",
                                    background:"#25D366", color:"#fff", fontWeight:600, fontSize:13 }}>
                                📱 WhatsApp
                            </button>
                            <button onClick={handlePrint}
                                style={{ flex:1, padding:"10px 0", borderRadius:8, border:"1px solid #e5e7eb",
                                    background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600, fontSize:13 }}>
                                🖨 Print
                            </button>
                            <button onClick={handleDownload}
                                style={{ flex:1, padding:"10px 0", borderRadius:8, border:"1px solid #e5e7eb",
                                    background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600, fontSize:13 }}>
                                ⬇ {receipt?.pdf_base64 ? "PDF" : "Save"}
                            </button>
                            {receipt?.pdf_base64 && (
                                <button onClick={handlePreviewPDF}
                                    style={{ flex:1, padding:"10px 0", borderRadius:8, border:"1px solid #e5e7eb",
                                        background:"#f0fdf4", color:"#059669", cursor:"pointer", fontWeight:600, fontSize:13 }}>
                                    👁 View
                                </button>
                            )}
                        </div>
                        <button onClick={onClose}
                            style={{ width:"100%", padding:"10px 0", borderRadius:8, border:"1px solid #e5e7eb",
                                background:"#f9fafb", color:"#6b7280", cursor:"pointer", fontSize:13 }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptViewer;