
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const questionsPerPage = 5;

  const emptyForm = {
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
  };

  const [form, setForm] = useState({ ...emptyForm });

  // Load exams
  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await fetch(
          "http://localhost:5555/api/exams"
        );

        if (!response.ok) {
          throw new Error("Failed to load exams.");
        }

        const data = await response.json();
        setExams(data);

        if (data.length > 0) {
          setSelectedExamId(String(data[0].id));
        }
      } catch (err) {
        setError(err.message || "Unable to load exams.");
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  // Load questions for selected exam
  useEffect(() => {
    if (!selectedExamId) {
      setQuestions([]);
      setCurrentPage(1);
      return;
    }

    const loadQuestions = async () => {
      setQuestionsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:5555/api/questions/exam/${selectedExamId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load questions.");
        }

        const data = await response.json();
        setQuestions(data);
        setCurrentPage(1);
      } catch (err) {
        setQuestions([]);
        setError(err.message || "Unable to load questions.");
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadQuestions();
  }, [selectedExamId]);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingQuestionId(null);
  };

  // Add or update question
  const handleSubmitQuestion = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedExamId) {
      setError("Please select an exam.");
      return;
    }

    const question = {
      examId: Number(selectedExamId),
      questionText: form.questionText.trim(),
      optionA: form.optionA.trim(),
      optionB: form.optionB.trim(),
      optionC: form.optionC.trim(),
      optionD: form.optionD.trim(),
      correctAnswer: form.correctAnswer,
    };

    try {
      const isEditing = editingQuestionId !== null;

      const url = isEditing
        ? `http://localhost:5555/api/questions/${editingQuestionId}`
        : "http://localhost:5555/api/questions";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
      });

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Could not update question."
            : "Could not add question."
        );
      }

      resetForm();

      // Refresh question list
      const questionsResponse = await fetch(
        `http://localhost:5555/api/questions/exam/${selectedExamId}`
      );

      if (!questionsResponse.ok) {
        throw new Error("Saved successfully, but refreshing failed.");
      }

      const data = await questionsResponse.json();
      setQuestions(data);
      setCurrentPage(1);

      setMessage(
        isEditing
          ? "Question updated successfully!"
          : "Question added successfully!"
      );
    } catch (err) {
      setError(err.message || "Unable to save question.");
    }
  };

  // Load question details into form for editing
  const handleEditQuestion = async (questionId) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5555/api/questions/${questionId}`
      );

      if (!response.ok) {
        throw new Error(
          "Could not load question details. Check your GET-by-ID API."
        );
      }

      const question = await response.json();

      setForm({
        questionText: question.questionText || "",
        optionA: question.optionA || "",
        optionB: question.optionB || "",
        optionC: question.optionC || "",
        optionD: question.optionD || "",
        correctAnswer: question.correctAnswer || "A",
      });

      setEditingQuestionId(questionId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Unable to load question.");
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5555/api/questions/${questionId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Could not delete question.");
      }

      const updatedQuestions = questions.filter(
        (question) => question.id !== questionId
      );

      setQuestions(updatedQuestions);

      const newTotalPages = Math.max(
        1,
        Math.ceil(updatedQuestions.length / questionsPerPage)
      );

      setCurrentPage((page) => Math.min(page, newTotalPages));

      if (editingQuestionId === questionId) {
        resetForm();
      }

      setMessage("Question deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete question.");
    }
  };

  // Sort questions by ID
  const sortedQuestions = [...questions].sort(
    (a, b) => a.id - b.id
  );

  // Pagination
  const totalPages = Math.ceil(
    sortedQuestions.length / questionsPerPage
  );

  const startIndex = (currentPage - 1) * questionsPerPage;

  const displayedQuestions = sortedQuestions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  if (loading) {
    return <p>Loading exams...</p>;
  }

  if (error && exams.length === 0) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Manage examinations and questions.</p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Available Exams</h2>

      {exams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Exam Name</th>
                <th>Description</th>
                <th>Total Marks</th>
              </tr>
            </thead>

            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.title}</td>
                  <td>{exam.description}</td>
                  <td>{exam.totalMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2>Manage Questions</h2>

      <label htmlFor="examSelect">Select Exam:</label>
      <br />

      <select
        id="examSelect"
        value={selectedExamId}
        onChange={(event) => {
          setSelectedExamId(event.target.value);
          setCurrentPage(1);
          setMessage("");
          setError("");
          resetForm();
        }}
        style={{
          padding: "10px",
          margin: "10px 0",
          minWidth: "250px",
        }}
      >
        {exams.map((exam) => (
          <option key={exam.id} value={exam.id}>
            {exam.title}
          </option>
        ))}
      </select>

      <h3>
        {editingQuestionId !== null
          ? "Edit Question"
          : "Add New Question"}
      </h3>

      <form
        onSubmit={handleSubmitQuestion}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "650px",
        }}
      >
        <textarea
          name="questionText"
          placeholder="Enter question"
          value={form.questionText}
          onChange={handleChange}
          required
          rows="3"
          style={{ padding: "10px" }}
        />

        <input
          name="optionA"
          placeholder="Option A"
          value={form.optionA}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />

        <input
          name="optionB"
          placeholder="Option B"
          value={form.optionB}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />

        <input
          name="optionC"
          placeholder="Option C"
          value={form.optionC}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />

        <input
          name="optionD"
          placeholder="Option D"
          value={form.optionD}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />

        <label htmlFor="correctAnswer">Correct Answer:</label>

        <select
          id="correctAnswer"
          name="correctAnswer"
          value={form.correctAnswer}
          onChange={handleChange}
          style={{ padding: "10px" }}
        >
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{ padding: "12px", cursor: "pointer" }}>
            {editingQuestionId !== null
              ? "Update Question"
              : "Add Question"}
          </button>

          {editingQuestionId !== null && (
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: "12px", cursor: "pointer" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginTop: "30px" }}>Existing Questions</h3>

      {questionsLoading ? (
        <p>Loading questions...</p>
      ) : displayedQuestions.length === 0 ? (
        <p>No questions found for this exam.</p>
      ) : (
        displayedQuestions.map((question, index) => (
          <div
            key={question.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "12px",
            }}
          >
            <p>
              <strong>
                {startIndex + index + 1}. {question.questionText}
              </strong>
            </p>

            <p>A. {question.optionA}</p>
            <p>B. {question.optionB}</p>
            <p>C. {question.optionC}</p>
            <p>D. {question.optionD}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => handleEditQuestion(question.id)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: "#1565c0",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Edit Question
              </button>

              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: "#c62828",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Delete Question
              </button>
            </div>
          </div>
        ))
      )}

      {!questionsLoading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
