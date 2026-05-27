function ScheduleList({ schedules, onDelete }) {
  if (schedules.length === 0) {
    return <p className="empty-text">등록된 일정이 없습니다.</p>;
  }

  return (
    <div className="list">
      {schedules.map((schedule) => (
        <article className="list-item" key={schedule.id}>
          <div>
            <h3>{schedule.title}</h3>
            <p>{schedule.description}</p>
            <span className="date-text">
              {schedule.startDate} ~ {schedule.endDate}
            </span>
          </div>

          <button className="danger-button" onClick={() => onDelete(schedule.id)}>
            삭제
          </button>
        </article>
      ))}
    </div>
  );
}

export default ScheduleList;