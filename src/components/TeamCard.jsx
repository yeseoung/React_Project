import { Link } from "react-router-dom";

function TeamCard({ team, onDelete }) {
  function handleDeleteClick() {
    onDelete(team.id);
  }

  return (
    <article className="card">
      <h3>{team.name}</h3>
      <p>{team.description}</p>

      <div className="meta">
        <span>팀장: {team.createdBy}</span>
        <span>팀원: {team.members.length}명</span>
      </div>

      <div className="card-actions">
        <Link className="button" to={`/teams/${team.id}`}>
          팀 상세 보기
        </Link>

        <button className="danger-button" type="button" onClick={handleDeleteClick}>
          팀 삭제
        </button>
      </div>
    </article>
  );
}

export default TeamCard;