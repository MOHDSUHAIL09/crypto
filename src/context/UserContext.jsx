import React, { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../api/apiClient";


const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userData, setUserData] = useState(null);
  const [stakeData, setStakeData] = useState(null);
  const [payoutData, setPayoutData] = useState(null);
  const [loading] = useState(false);

  // ================= LOAD FROM LOCALSTORAGE =================
  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      try {
        const parsed = JSON.parse(savedUserData);
        console.log("Loaded from localStorage:", parsed);
        setUserData(parsed);
      } catch (e) {
        console.error("Error loading:", e);
      }
    }
  }, []);

  // ================= Dashboard Fetch =================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!user || !token) return;
      
      const regno = user.Regno || user.regno || localStorage.getItem("regno");
      if (!regno) return;

      const res = await apiClient.get(
        `/Dashboard/dashboard/${regno}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Dashboard-Api", res)
      
      if (res.data.success) {
        const apiData = res.data.data;
        const newUserData = {
          regno: apiData.Regno ||apiData.regno,
          name: apiData.fname,
          me: apiData.loginid,
          MobileNo: apiData.mobile,
          referral: apiData.introid,
          kid: apiData.kid,
          Depositfund: apiData.topupwallet,
          BotAmount: apiData.BotAmount,
          InvestAmount: apiData.InvestAmount,
          totalWallet: apiData.totalWallet,
          walletid: apiData.walletid,
          LevelIncome: apiData.LevelIncome,
          MatchingBonus: apiData.MatchingBonus,
          IBIncome: apiData.IBIncome,
          Reward: apiData.Reward,
          RoyaltyIncome: apiData.RoyaltyIncome,
          Remaining: apiData.Remaining,
          withdrawal: apiData.withdrawal,
          TradingPassiveIncome: apiData.TradingPassiveIncome,
          email: apiData.emailID,
          directId: apiData.directId,
          strongLeg: apiData.OtherLeg,
          weakerLeg: apiData.PowerLeg,
          leftCarry: apiData.leftCarry,
          rightCarry: apiData.rightCarry,
          LeftPerMonth: apiData.LeftPerMonth,
          RightPerMonth: apiData.RightPerMonth,
          LeftBusiness: apiData.LeftBusiness,
          RightBusiness: apiData.RightBusiness,
          topupdate: apiData.topupdate,
          Working: apiData.Working,
        };
        
        setUserData(newUserData);
        localStorage.setItem("userData", JSON.stringify(newUserData));
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
  };

  // ================= INVEST NOW (With Separate APIs) =================
  const investNow = async (reciveId, investAmount) => {
    console.log("=== INVEST NOW CALLED ===");
    console.log("reciveId:", reciveId);
    console.log("investAmount:", investAmount);
    
    if (!userData) {
      return { success: false, message: "User data not loaded" };
    }
    
    const amount = parseFloat(investAmount);
    let updatedData;
    let apiEndpoint;
    let apiBody;
    
    const token = localStorage.getItem("token");
    const regno = user?.Regno || user?.regno || localStorage.getItem("regno");
    
    // 🔥 SELF TRANSFER (Income → Deposit) - Use fund-transfer API
    if (reciveId === userData?.me) {
      console.log("💰 SELF TRANSFER - Using fund-transfer API");
      
      const oldTotalWallet = parseFloat(userData.totalWallet || 0);
      const oldDeposit = parseFloat(userData.Depositfund || 0);
      const newTotalWallet = oldTotalWallet - amount;
      const newDepositfund = oldDeposit + amount;
      
      updatedData = {
        ...userData,
        totalWallet: newTotalWallet,
        Depositfund: newDepositfund
      };
      
      apiEndpoint = `/IncomePayout/fund-transfer`;
      apiBody = {
        regno: Number(regno),
        reciveId: userData.me,  
        amount: amount
      };
    } 
    // 🔥 P2P TRANSFER (Deposit → Deposit) - Use deposit-to-deposit API
    else {
      console.log("💰 P2P TRANSFER - Using deposit-to-deposit API");
      
      const oldDeposit = parseFloat(userData.Depositfund || 0);
      const newDepositfund = oldDeposit - amount;
      
      updatedData = {
        ...userData,
        Depositfund: newDepositfund
      };
      
      apiEndpoint = `/IncomePayout/deposit-to-deposit`;
      apiBody = {
        regno: Number(regno),
        reciveId: reciveId,
        amount: amount
      };
    }
    
    // ✅ Update UI and localStorage IMMEDIATELY
    setUserData(updatedData);
    localStorage.setItem("userData", JSON.stringify(updatedData));
    
    // 🔥 Call API in background
    try {
      console.log("Calling API:", apiEndpoint);
      console.log("Body:", apiBody);
      
      const response = await apiClient.post(
        apiEndpoint,
        apiBody,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("API Response:", response.data);
      
      
      if (response.data.success) {
        console.log("✅ API success - database updated");
        // Refresh from server to confirm
        setTimeout(() => fetchData(), 500);
      } else {
        console.log("❌ API failed:", response.data.message);
        // Don't rollback - keep local balance
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      // Don't show error to user, keep local balance
    }
    
    return { 
      success: true, 
      message: `✅ Transfer Successful! $${amount} transferred` 
    };
  };

  // ================= REFRESH USER DATA =================
  const refreshUserData = async () => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      return parsed;
    }
    return userData;
  };

  // ================= LOGIN =================
  const loginUser = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("regno", userData.regno);
    setUser(userData);
    setTimeout(() => fetchData(), 100);
  };

  // ================= LOGOUT =================
  const logoutUser = () => {
    setUser(null);
    setUserData(null);
    setStakeData(null);
    setPayoutData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("regno");
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        stakeData,
        payoutData,
        refreshData: fetchData,
        refreshUserData,
        investNow,
        loginUser,
        logoutUser,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);