import { Route, Routes } from "react-router-dom";
import ProtecedRoute from "../../components/route/ProtecedRoute";

import Dashboard from "./Dashboard";
import Header from "./Dasbord-UI/Header";
import Sidebar from "./Dasbord-UI/Sidebar";
import DownlineTeam from "./UserDetails/DownLineTeam";
import Rebards from "./UserDetails/Rebards";
import BonusReport from "./UserDetails/Royalty";
import TreeView from "./UserDetails/TreeView";
import { Deposit2Deposit } from "./UserDetails/Deposit2Deposit";
import DepositHistory from "./UserDetails/DepositHistory";
import AccStatement from "./AccStatement";
import CapitalPayout from "./CapitalPayout/CapitalPayout";
import CapitalWithdrawalRequest from "./CapitalPayout/CapitalWithdrawalRequest";
import InvestmentHistory from "./InvestmentHistory";
import Profaile from "./Profile/profile/Profile";
import ChangePassword from "./Profile/ChangePassword/ChangePassword";
import { Epin } from "./Profile/Epin/Epin";
import Support from "./UserDetails/Support/Support";
import SupportHelp from "./UserDetails/Support/SupportHelp";

const Main = () => {
  return (
    <Routes>

      {/* 🔥 TreeView Full Screen */}
      <Route
        path="/TreeView"
        element={
          <ProtecedRoute>
            <TreeView />
          </ProtecedRoute>
        }
      />
     <Route path="/supporthelp/:id" element={<SupportHelp />} />
 
      {/* 🔥 Dashboard Layout */}
      <Route
        path="/*"
        element={
          <div className="dashboard-container">
            <Sidebar />

            <div className="layout">
              <Header />

              <Routes>
                <Route index element={<Dashboard />} />

                <Route
                  path="downline-team"
                  element={
                    <ProtecedRoute>
                      <DownlineTeam />
                    </ProtecedRoute>
                  }
                />

                <Route path="deposit2deposit" element={<Deposit2Deposit />} />

                <Route
                  path="rewards"
                  element={
                    <ProtecedRoute>
                      <Rebards />
                    </ProtecedRoute>
                  }
                />

                <Route
                  path="royalty"
                  element={
                    <ProtecedRoute>
                      <BonusReport />
                    </ProtecedRoute>
                  }
                />

                <Route
                  path="/Support"
                  element={
                    <ProtecedRoute>
                      <Support />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="depositHistory"
                  element={
                    <ProtecedRoute>
                      <DepositHistory />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="accstatement"
                  element={
                    <ProtecedRoute>
                      <AccStatement />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="capitalpayout"
                  element={
                    <ProtecedRoute>
                      <CapitalPayout />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="/capitalwithdrawalrequest"
                  element={
                    <ProtecedRoute>
                      <CapitalWithdrawalRequest />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="/investmenthistory"
                  element={
                    <ProtecedRoute>
                      <InvestmentHistory />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtecedRoute>
                      <Profaile />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="/changepassword"
                  element={
                    <ProtecedRoute>
                      <ChangePassword />
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="/epin"
                  element={
                    <ProtecedRoute>
                      <Epin />
                    </ProtecedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        }
      />

    </Routes>
  );
};

export default Main;