import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import TeamListPage from "./pages/TeamListPage";
import TeamCreatePage from "./pages/TeamCreatePage";
import TeamDetailPage from "./pages/TeamDetailPage";
import SchedulePage from "./pages/SchedulePage";
import RolePage from "./pages/RolePage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/teams" replace />} />
        <Route path="/teams" element={<TeamListPage />} />
        <Route path="/teams/new" element={<TeamCreatePage />} />
        <Route path="/teams/:teamId" element={<TeamDetailPage />} />
        <Route path="/teams/:teamId/schedules" element={<SchedulePage />} />
        <Route path="/teams/:teamId/roles" element={<RolePage />} />
      </Route>
    </Routes>
  );
}

export default App;