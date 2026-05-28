import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// 🌟 1. mockApi 대신 진짜 teamApi에서 getTeamById를 가져옵니다.
import { getTeamById } from "../api/mockApi"; 

function TeamDetailPage() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 💡 로딩 상태 추가

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // 🌟 2. 진짜 MySQL 데이터베이스로부터 팀 정보를 조회해옵니다.
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
        
        // 일정과 역할 분담은 아직 mock 상태라면 임시 데이터나 빈 배열 유지
        setSchedules([]);
        setRoles([]);
      } catch (error) {
        console.error("상세 정보 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [teamId]);

  // 💡 로딩 중일 때 문구 노출
  if (isLoading) {
    return <p className="empty-text">데이터베이스에서 팀 상세 정보를 불러오는 중...</p>;
  }

  // 🌟 teamData가 null일 때 이 조건문이 발동합니다.
  if (!team) {
    return (
      <section style={{ textAlign: "center", padding: "40px" }}>
        <p className="empty-text">⚠️ {teamId}번 팀 정보를 찾을 수 없습니다.</p>
        <Link to="/teams" className="button" style={{ marginTop: "20px" }}>
          목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="eyebrow">Team Detail</p>
      <h1>{team.name}</h1>
      <p className="sub-text">{team.description}</p>

      <div className="summary-grid">
        <div className="summary-card">
          {/* 🌟 이제 진짜 데이터베이스의 members 배열 길이가 안전하게 찍힙니다. */}
          <strong>{team.members ? team.members.length : 0}</strong>
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
          {team.members && team.members.map((member) => (
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