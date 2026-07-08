import { useState, useEffect } from "react";
import { GetSessionData } from "../../utils/SessionManagement";
import AccountsGateway from "./AccountsGateway";
import GroupsLedgers from "./GroupsLedgers";
import SystemRoles from "./SystemRoles";
import VoucherEntry from "./VoucherEntry";
import DayBook from "./DayBook";
import CollectionRegister from "./CollectionRegister";
import CashBankBook from "./CashBankBook";
import AccountsReports from "./AccountsReports";
import BudgetManager from "./BudgetManager";
import BankAccounts from "./BankAccounts";
import PeriodLock from "./PeriodLock";

// Rendered from Dashboard.jsx's PAGES map as: accounts: <Accounts setActive={setActive} />
// Internal navigation is a screen-stack (Tally model): Gateway → screen, Esc pops back.
const Accounts = ({ setActive }) => {
  const [screen, setScreen] = useState("gateway");
  const [societyId, setSocietyId] = useState("");
  const [societyName, setSocietyName] = useState("");

  useEffect(() => {
    (async () => {
      const data = await GetSessionData();
      const flats = data.data.flats[0];
      setSocietyId(flats.society_id);
      setSocietyName(data.data.society_name || "");
    })();
  }, []);

  const goBack = () => {
    if (screen === "gateway") {
      setActive?.("overview"); // leave the Accounts module entirely, back to Dashboard's default tab
    } else {
      setScreen("gateway");
    }
  };

  if (!societyId) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>Loading…</div>;
  }

  const props = { societyId, onEscape: goBack };

  switch (screen) {
    case "vouchers":  return <VoucherEntry {...props} />;
    case "ledgers":   return <GroupsLedgers {...props} />;
    case "roles":     return <SystemRoles {...props} />;
    case "daybook":   return <DayBook {...props} />;
    case "collection": return <CollectionRegister {...props} />;
    case "cashbank":  return <CashBankBook {...props} />;
    case "reports":   return <AccountsReports {...props} />;
    case "budget":    return <BudgetManager {...props} />;
    case "bank":      return <BankAccounts {...props} />;
    case "periods":   return <PeriodLock {...props} />;
    default:
      return <AccountsGateway societyId={societyId} societyName={societyName} onNavigate={setScreen} onExit={goBack} />;
  }
};

export default Accounts;
