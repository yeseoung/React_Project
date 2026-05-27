import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeamById, getSchedulesByTeamId, getRolesByTeamId } from "../api/mockApi";

function TeamDetailPage() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function loadData() {
      const teamData = await getTeamById(teamId);
      const scheduleData = await getSchedulesByTeamId(teamId);
      const roleData = await getRolesByTeamId(teamId);

      setTeam(teamData);
      setSchedules(scheduleData);
      setRoles(roleData);
    }

    loadData();
  }, [teamId]);

  if (!team) {
    return <p>팀 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <section>
      <p className="eyebrow">Team Detail</p>
      <h1>{team.name}</h1>
      <p className="sub-text">{team.description}</p>

      <div className="summary-grid">
        <div className="summary-card">
          <strong>{team.members.length}</strong>
          <span>팀원 수</span>
        </div>
        <div className="summary-card">
          <strong>{schedules.length}</strong>
          <span>등록 일정</span>
        </div>
        <div className="summary-card">
          <strong>{roles.length}</strong>
          <span>역할 분담</span>
        </div>
      </div>

      <div className="members-box">
        <h2>팀원</h2>
        <div className="tag-list">
          {team.members.map((member) => (
            <span className="tag" key={member}>
              {member}
            </span>
          ))}
        </div>
      </div>

      <div className="action-row">
        <Link className="primary-button" to={`/teams/${team.id}/schedules`}>
          일정 관리
        </Link>
        <Link className="button" to={`/teams/${team.id}/roles`}>
          역할 분담
        </Link>
      </div>
    </section>
  );
}

export default TeamDetailPage;