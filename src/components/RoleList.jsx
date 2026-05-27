const statusLabel = {
  todo: "예정",
  in_progress: "진행 중",
  done: "완료",
};

function RoleList({ roles, onStatusChange, onDelete }) {
  if (roles.length === 0) {
    return <p className="empty-text">등록된 역할이 없습니다.</p>;
  }

  return (
    <div className="list">
      {roles.map((role) => (
        <article className="list-item" key={role.id}>
          <div>
            <h3>{role.title}</h3>
            <p>{role.description}</p>
            <span className="date-text">
              담당자: {role.assignedTo} / 마감일: {role.dueDate || "미정"}
            </span>
            <div className="status-row">
              <span className={`status ${role.status}`}>
                {statusLabel[role.status]}
              </span>
            </div>
          </div>

          <div className="button-column">
            <select
              value={role.status}
              onChange={(event) => onStatusChange(role.id, event.target.value)}
            >
              <option value="todo">예정</option>
              <option value="in_progress">진행 중</option>
              <option value="done">완료</option>
            </select>

            <button className="danger-button" onClick={() => onDelete(role.id)}>
              삭제
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default RoleList;