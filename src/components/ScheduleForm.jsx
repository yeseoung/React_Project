import { useState } from "react";

function ScheduleForm({ onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
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
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>일정 등록</h2>
      {error && <p className="error-message">{error}</p>}

      <label>
        일정 제목
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="예: 최종 발표 준비"
        />
      </label>

      <label>
        설명
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="일정 설명을 입력하세요."
        />
      </label>

      <div className="two-column">
        <label>
          시작일
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </label>

        <label>
          종료일
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </label>
      </div>

      <button className="primary-button" type="submit">
        일정 추가
      </button>
    </form>
  );
}

export default ScheduleForm;