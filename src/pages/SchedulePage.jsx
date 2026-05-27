import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createSchedule,
  deleteSchedule,
  getSchedulesByTeamId,
  getTeamById,
} from "../api/mockApi";
import ScheduleForm from "../components/ScheduleForm";
import ScheduleList from "../components/ScheduleList";

function SchedulePage() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [schedules, setSchedules] = useState([]);

  async function loadSchedules() {
    const scheduleData = await getSchedulesByTeamId(teamId);
    setSchedules(scheduleData);
  }

  useEffect(() => {
    async function loadData() {
      const teamData = await getTeamById(teamId);
      setTeam(teamData);
      await loadSchedules();
    }

    loadData();
  }, [teamId]);

  async function handleCreateSchedule(form) {
    await createSchedule(teamId, form);
    await loadSchedules();
  }

  async function handleDeleteSchedule(scheduleId) {
    await deleteSchedule(scheduleId);
    await loadSchedules();
  }

  return (
    <section>
      <Link className="back-link" to={`/teams/${teamId}`}>
        ← 팀 상세로 돌아가기
      </Link>

      <p className="eyebrow">Schedule Management</p>
      <h1>{team ? team.name : "팀"} 일정 관리</h1>
      <p className="sub-text">
        팀 전체가 확인해야 하는 마감일과 주요 일정을 등록합니다.
      </p>

      <div className="content-grid">
        <ScheduleForm onCreate={handleCreateSchedule} />

        <div>
          <h2>등록된 일정</h2>
          <ScheduleList
            schedules={schedules}
            onDelete={handleDeleteSchedule}
          />
        </div>
      </div>
    </section>
  );
}

export default SchedulePage;