import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createRole, //역할생성
  deleteRole, //역할삭제
  getRolesByTeamId, //아이디기반 역할참조
  getTeamById, //아이디기반 팀참조
  updateRoleStatus, //역할 갱신
} from "../api/mockApi";
import RoleForm from "../components/RoleForm";
import RoleList from "../components/RoleList";

function RolePage() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [roles, setRoles] = useState([]);

  async function loadRoles() {
    const roleData = await getRolesByTeamId(teamId);
    setRoles(roleData);
  }

  useEffect(() => {
    async function loadData() {
      const teamData = await getTeamById(teamId);
      setTeam(teamData);
      await loadRoles();
    }

    loadData();
  }, [teamId]);

  async function handleCreateRole(form) {
    await createRole(teamId, form);
    await loadRoles();
  }

  async function handleStatusChange(roleId, status) {
    await updateRoleStatus(roleId, status);
    await loadRoles();
  }

  async function handleDeleteRole(roleId) {
    await deleteRole(roleId);
    await loadRoles();
  }

  return (
    <section>
      <Link className="back-link" to={`/teams/${teamId}`}>
        ← 팀 상세로 돌아가기
      </Link>

      <p className="eyebrow">Role Assignment</p>
      <h1>{team ? team.name : "팀"} 역할 분담</h1>
      <p className="sub-text">
        팀원별 담당 업무를 명확히 지정하여 업무 편중을 줄입니다.
      </p>

      <div className="content-grid">
        <RoleForm
          members={team ? team.members : []}
          onCreate={handleCreateRole}
        />

        <div>
          <h2>역할 목록</h2>
          <RoleList
            roles={roles}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRole}
          />
        </div>
      </div>
    </section>
  );
}

export default RolePage;