import Cards from "./Card/Cards";
import LevelIncome from "./LevelIncome";

const Dashboard = () => {
  return (
        <>
        <div className="dashboard-container">
         <Cards />
        <LevelIncome/>
      </div>
        </>
  );
};
export default Dashboard; 
