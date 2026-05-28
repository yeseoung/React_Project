import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../api/mockApi";

function TeamCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    createdBy: "",
    membersText: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("팀 이름을 입력해주세요.");
      return;
    }

    const members = form.membersText
      .split(",")
      .map((member) => member.trim())
      .filter(Boolean);

    const newTeam = await createTeam({
      name: form.name,
      description: form.description,
      createdBy: form.createdBy,
      members,
    });

    navigate(`/teams/${newTeam.id}`);
  }

  return (
    <section className="form-page">
      <p className="eyebrow">Create Team</p>
      <h1>새 팀 만들기</h1>
      <p className="sub-text">
        팀 프로젝트를 만들고 팀원, 일정, 역할을 관리할 수 있습니다.
      </p>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <label>
          팀 이름
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="예: 소프트웨어공학 팀프로젝트"
          />
        </label>

        <label>
          팀 설명
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="팀 프로젝트 설명을 입력하세요."
          />
        </label>

        <label>
          팀장
          <input
            name="createdBy"
            value={form.createdBy}
            onChange={handleChange}
            placeholder="필수 입력사항입니다."
          />
        </label>

        <label>
          팀원 목록
          <input
            name="membersText"
            value={form.membersText}
            onChange={handleChange}
            placeholder="쉼표로 구분해서 입력"
          />
        </label>

        <button className="primary-button" type="submit">
          팀 생성
        </button>
      </form>
    </section>
  );
}

export default TeamCreatePage;