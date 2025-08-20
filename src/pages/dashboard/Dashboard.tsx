import Matches from "./components/Matches/Matches";
import Skills from "./components/Skills/Skills";

const Dashboard = () => {
  return (
    <div className="space-y-5">
      <Skills />
      <Matches />
    </div>
  );
};

export default Dashboard;
