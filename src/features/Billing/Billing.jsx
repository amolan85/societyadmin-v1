import { useState } from "react";
import BillingDashboard from "./BillingDashboard";
import BillsList        from "./BillsList";
import ViewBill         from "./ViewBill";
import ChargeHeads      from "./ChargeHeads";
import FlatCharges      from "./FlatCharges";
import { FlatLedger, BillingSettings, OpeningBalance } from "./BillingSubPages";

/**
 * Billing — top-level container
 * Receives setActive from Dashboard (to navigate back to main nav)
 * Manages internal billing sub-page routing
 */
const Billing = ({ setActive: setMainActive }) => {
    const [page, setPage]     = useState("billingDashboard");
    const [billId, setBillId] = useState(null);

    const navigate = (p) => setPage(p);

    const pages = {
        billingDashboard: <BillingDashboard setActive={navigate} setBillId={setBillId} />,
        billsList:        <BillsList        setActive={navigate} setBillId={setBillId} />,
        viewBill:         <ViewBill         setActive={navigate} billId={billId} />,
        chargeHeads:      <ChargeHeads      setActive={navigate} />,
        flatCharges:      <FlatCharges      setActive={navigate} />,
        flatLedger:       <FlatLedger       setActive={navigate} />,
        billingSettings:  <BillingSettings  setActive={navigate} />,
        openingBalance:   <OpeningBalance   setActive={navigate} />,
        generateBill:     <BillsList        setActive={navigate} setBillId={setBillId} />, // reuse BillsList with modal open
        recordPayment:    <BillsList        setActive={navigate} setBillId={setBillId} />,
    };

    return pages[page] || pages["billingDashboard"];
};

export default Billing;
