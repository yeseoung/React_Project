import axios from "axios";
const STORAGE_KEY = "makebozo_frontend_data";
const  api = axios.create({baseURL : "http://127.0.0.1:8000/api",})

const initialData = {
  teams: [],
  schedules: [],
  roles: []
};

/**
 * 🔄 [GET] 데이터베이스로부터 전체 팀 목록을 조회하는 함수
 * @returns {Promise<Array>} 파이썬 백엔드가 정제해서 보내준 팀 객체 배열
 */
export async function getTeams() {
  try {
    // 🐍 FastAPI의 @app.get("/api/teams") 엔드포인트를 호출합니다.
    const response = await api.get("/teams");
    
    // 백엔드에서 정제해 준 [ { id, name, description, createdBy, members: [...] }, ... ] 리턴
    return response.data; 
  } catch (error) {
    console.error("❌ 백엔드로부터 팀 목록을 가져오는 중 에러 발생:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * 🚀 [POST] 새로운 팀과 팀원 목록을 데이터베이스에 저장하는 함수
 * @param {Object} teamInput - { name, description, createdBy, members: ["이름1", "이름2"] }
 */
export async function createTeam(teamInput) {
  try {
    // 🐍 FastAPI의 @app.post("/api/teams") 엔드포인트로 JSON 데이터를 전송합니다.
    const response = await api.post("/teams", {
      name: teamInput.name,
      description: teamInput.description,
      createdBy: teamInput.createdBy,
      members: teamInput.members, // 문자열 배열 형태 그대로 전달
    });
    return response.data; // MySQL에 저장된 후 생성된 신규 팀 객체(id 포함) 리턴
  } catch (error) {
    console.error("❌ 팀 생성 중 에러 발생:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * 🗑️ [DELETE] 특정 팀을 데이터베이스에서 완전히 삭제하는 함수
 * @param {number} teamId - 삭제할 팀의 고유 ID (PK)
 */
export async function deleteTeam(teamId) {
  try {
    // 🐍 FastAPI의 @app.delete("/api/teams/{team_id}") 엔드포인트를 URL 파라미터와 함께 호출합니다.
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("❌ 팀 삭제 중 에러 발생:", error.response?.data || error.message);
    throw error;
  }
}

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

export async function getTeamById(teamId) {
  try {
    const response = await api.get(`/teams/${teamId}`);
    return response.data; // 파이썬이 리턴한 단일 팀 객체 반환
  } catch (error) {
    console.error(`❌ ${teamId}번 팀 로드 실패:`, error);
    return null; // 에러 발생 시 null을 리턴하여 예외 처리
  }
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