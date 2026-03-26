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
                      <Rebards/>
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
                  path="depositHistory"
                  element={
                    <ProtecedRoute>
                      <DepositHistory/>
                    </ProtecedRoute>
                  }
                />
                <Route
                  path="/accstatement"
                  element={
                    <ProtecedRoute>
                      <AccStatement/>
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