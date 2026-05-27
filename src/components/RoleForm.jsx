import { useState } from "react";

function RoleForm({ members, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "todo",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await onCreate(form);
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "todo",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>역할 등록</h2>
      {error && <p className="error-message">{error}</p>}

      <label>
        역할 제목
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="예: 발표 대본 작성"
        />
      </label>

      <label>
        설명
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="업무 내용을 입력하세요."
        />
      </label>

      <label>
        담당자
        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
        >
          <option value="">담당자를 선택하세요</option>
          {members.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
      </label>

      <label>
        마감일
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
      </label>

      <button className="primary-button" type="submit">
        역할 추가
      </button>
    </form>
  );
}

export default RoleForm;