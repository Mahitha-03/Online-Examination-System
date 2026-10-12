
import { useEffect, useState } from "react";

function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5555/api/exams")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }
        return response.json();
      })
      .then((data) => {
        setExams(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading exams...</h2>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="exam-container">
      <h1>Available Examinations</h1>

      {exams.length === 0 ? (
        <p>No examinations available.</p>
      ) : (
        <div className="exam-grid">
          {exams.map((exam) => (
            <div className="exam-card" key={exam.id}>
              <h2>{exam.title}</h2>
              <p>{exam.description}</p>
              <p>
                <strong>Duration:</strong> {exam.durationMinutes} minutes
              </p>
              <p>
                <strong>Total Marks:</strong> {exam.totalMarks}
              </p>
<button
  onClick={() => window.location.href = `/exam?examId=${exam.id}&title=${encodeURIComponent(exam.title)}`}
>
  Start Exam
</button>
     
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Exams;
