import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTeam, getTeams } from "../api/mockApi";
import TeamCard from "../components/TeamCard";

function TeamListPage() {
  const [teams, setTeams] = useState([]);

  async function loadTeams() {
    const result = await getTeams();
    setTeams(result);
  }

  useEffect(() => {
    loadTeams();
  }, []);

  async function handleDeleteTeam(teamId) {
    const isConfirmed = window.confirm(
      "정말 이 팀을 삭제하시겠습니까? 이 팀의 일정과 역할도 함께 삭제됩니다."
    );

    if (!isConfirmed) {
      return;
    }

    await deleteTeam(teamId);
    await loadTeams();
  }

  return (
    <section>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Team Collaboration System</p>
          <h1>팀 목록</h1>
          <p className="sub-text">
            팀 프로젝트의 일정과 역할을 한 곳에서 관리합니다.
          </p>
        </div>

        <Link className="primary-button" to="/teams/new">
          새 팀 만들기
        </Link>
      </div>

      {teams.length === 0 ? (
        <p className="empty-text">
          아직 생성된 팀이 없습니다. 새 팀을 만들어보세요.
        </p>
      ) : (
        <div className="grid">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDelete={handleDeleteTeam}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TeamListPage;