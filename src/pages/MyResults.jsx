
import { useEffect, useState } from "react";

function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
      setError("Please log in to view your results.");
      setLoading(false);
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      setError("Invalid login information. Please log in again.");
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5555/api/my-results/${user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load your exam results.");
        }
        return response.json();
      })
      .then((data) => setResults(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const examNames = {
    1: "Core Java",
    2: "Advanced Java",
    3: "SQL Examination",
    4: "Spring Boot Examination",
    5: "React Examination",
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading your results...</p>;
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        {error}
      </p>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        My Exam Results
      </h2>

      {results.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          You have not submitted any exams yet.
        </p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            maxWidth: "100%",
            borderRadius: "8px",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              minWidth: "700px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1b3d70", color: "#ffffff" }}>
                <th style={cellStyle}>Exam Name</th>
                <th style={cellStyle}>Score</th>
                <th style={cellStyle}>Total Questions</th>
                <th style={cellStyle}>Answered</th>
                <th style={cellStyle}>Percentage</th>
                <th style={cellStyle}>Submitted At</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result, index) => {
                const percentage =
                  result.totalQuestions > 0
                    ? Math.round(
                        (result.score / result.totalQuestions) * 100
                      )
                    : 0;

                return (
                  <tr
                    key={result.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f5f7fb" : "#ffffff",
                      color: "#263445",
                    }}
                  >
                    <td style={cellStyle}>
                      {examNames[result.examId] || `Exam ${result.examId}`}
                    </td>

                    <td style={cellStyle}>
                      {result.score} / {result.totalQuestions}
                    </td>

                    <td style={cellStyle}>{result.totalQuestions}</td>

                    <td style={cellStyle}>{result.answeredQuestions}</td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: percentage >= 50 ? "#167447" : "#b45309",
                        }}
                      >
                        {percentage}%
                      </span>
                    </td>

                    <td style={cellStyle}>
                      {result.submittedAt
                        ? new Date(result.submittedAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cellStyle = {
  padding: "12px",
  border: "1px solid #dce3ed",
  whiteSpace: "nowrap",
};

export default MyResults;
