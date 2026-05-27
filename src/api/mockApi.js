const STORAGE_KEY = "makebozo_frontend_data";

const initialData = {
  teams: [
    {
      id: 1,
      name: "소프트웨어공학 팀프로젝트",
      description: "팀플 일정 및 역할관리 서비스 개발",
      createdBy: "장세미",
      members: ["장세미", "고예성", "김지유", "서주희"],
    },
  ],
  schedules: [
    {
      id: 1,
      teamId: 1,
      title: "최종 발표 준비",
      description: "PPT와 발표 대본 정리",
      startDate: "2026-04-10",
      endDate: "2026-06-01",
      createdBy: "서주희",
    },
  ],
  roles: [
    {
      id: 1,
      teamId: 1,
      title: "프론트엔드 화면 구현",
      description: "팀 목록, 일정, 역할 분담 화면 구현",
      assignedTo: "장세미",
      dueDate: "2026-05-27",
      status: "in_progress",
    },
    {
      id: 2,
      teamId: 1,
      title: "백엔드 DB 설계",
      description: "팀, 일정, 역할 테이블 설계",
      assignedTo: "고예성",
      dueDate: "2026-05-29",
      status: "todo",
    },
  ],
};

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  return JSON.parse(saved);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}

export async function getTeams() {
  const data = loadData();
  return data.teams;
}

export async function getTeamById(teamId) {
  const data = loadData();
  return data.teams.find((team) => team.id === Number(teamId));
}

export async function createTeam(teamInput) {
  const data = loadData();

  const newTeam = {
    id: createId(data.teams),
    name: teamInput.name,
    description: teamInput.description,
    createdBy: teamInput.createdBy || "김지유",
    members: teamInput.members || ["김지유"],
  };

  data.teams.push(newTeam);
  saveData(data);

  return newTeam;
}

export async function getSchedulesByTeamId(teamId) {
  const data = loadData();
  return data.schedules.filter((schedule) => schedule.teamId === Number(teamId));
}

export async function createSchedule(teamId, scheduleInput) {
  const data = loadData();

  if (!scheduleInput.title.trim()) {
    throw new Error("일정 제목을 입력해주세요.");
  }

  if (!scheduleInput.startDate || !scheduleInput.endDate) {
    throw new Error("시작일과 종료일을 모두 입력해주세요.");
  }

  if (scheduleInput.startDate > scheduleInput.endDate) {
    throw new Error("종료일은 시작일보다 빠를 수 없습니다.");
  }

  const newSchedule = {
    id: createId(data.schedules),
    teamId: Number(teamId),
    title: scheduleInput.title,
    description: scheduleInput.description,
    startDate: scheduleInput.startDate,
    endDate: scheduleInput.endDate,
    createdBy: scheduleInput.createdBy || "김지유",
  };

  data.schedules.push(newSchedule);
  saveData(data);

  return newSchedule;
}

export async function deleteSchedule(scheduleId) {
  const data = loadData();
  data.schedules = data.schedules.filter(
    (schedule) => schedule.id !== Number(scheduleId)
  );
  saveData(data);
}

export async function getRolesByTeamId(teamId) {
  const data = loadData();
  return data.roles.filter((role) => role.teamId === Number(teamId));
}

export async function createRole(teamId, roleInput) {
  const data = loadData();

  if (!roleInput.title.trim()) {
    throw new Error("역할 제목을 입력해주세요.");
  }

  if (!roleInput.assignedTo.trim()) {
    throw new Error("담당자를 지정해주세요.");
  }

  const newRole = {
    id: createId(data.roles),
    teamId: Number(teamId),
    title: roleInput.title,
    description: roleInput.description,
    assignedTo: roleInput.assignedTo,
    dueDate: roleInput.dueDate,
    status: roleInput.status || "todo",
  };

  data.roles.push(newRole);
  saveData(data);

  return newRole;
}

export async function updateRoleStatus(roleId, status) {
  const data = loadData();

  data.roles = data.roles.map((role) =>
    role.id === Number(roleId) ? { ...role, status } : role
  );

  saveData(data);
}

export async function deleteRole(roleId) {
  const data = loadData();
  data.roles = data.roles.filter((role) => role.id !== Number(roleId));
  saveData(data);
}

export async function deleteTeam(teamId) {
  const data = loadData();
  const targetTeamId = Number(teamId);

  data.teams = data.teams.filter((team) => team.id !== targetTeamId);

  // 팀을 삭제하면 해당 팀의 일정과 역할도 함께 삭제
  data.schedules = data.schedules.filter(
    (schedule) => schedule.teamId !== targetTeamId
  );

  data.roles = data.roles.filter((role) => role.teamId !== targetTeamId);

  saveData(data);
}