
import { useEffect, useState } from "react";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Get exam ID and title from the URL
  const params = new URLSearchParams(window.location.search);
  const examId = params.get("examId") || "1";
  const examTitle = params.get("title") || "Java Examination";

  // Load questions from Spring Boot
  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`http://localhost:5555/api/questions/exam/${examId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load questions.");
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
        setCurrentQuestion(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [examId]);

  // Submit answers and save the result with the user's ID
  const handleSubmit = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit the exam?"
    );

    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Get the logged-in user's details
      const savedUser = localStorage.getItem("loggedInUser");

      if (!savedUser) {
        throw new Error("Please log in again before submitting.");
      }

      const loggedInUser = JSON.parse(savedUser);
      const userId = loggedInUser?.id;

      if (!userId) {
        throw new Error(
          "User ID not found. Please log out and log in again."
        );
      }

      const response = await fetch(
        `http://localhost:5555/api/results/submit/${examId}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedAnswers),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to submit the exam.");
      }

      const data = await response.json();

      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
      window.alert("Could not submit the exam: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="loading-message">Loading questions...</p>;
  }

  if (error && questions.length === 0) {
    return (
      <div className="question-container">
        <div className="question-card">
          <h2>Unable to Load Questions</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => (window.location.href = "/exams")}>
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="question-container">
        <div className="question-card">
          <h2>{examTitle}</h2>
          <p>No questions available for this exam.</p>
          <button onClick={() => (window.location.href = "/exams")}>
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  // Display the result returned by Spring Boot
  if (submitted && result) {
    const percentage =
      result.totalQuestions > 0
        ? Math.round(
            (result.score / result.totalQuestions) * 100
          )
        : 0;

    return (
      <div className="question-container">
        <div className="question-card">
          <h1>Exam Submitted Successfully!</h1>
          <h2>{examTitle}</h2>

          <h2>
            Your Score: {result.score} / {result.totalQuestions}
          </h2>

          <p>
            Questions answered: {result.answeredQuestions} /{" "}
            {result.totalQuestions}
          </p>

          <p>Percentage: {percentage}%</p>

          <p>Your result has been saved to the database.</p>

          <button onClick={() => (window.location.href = "/exams")}>
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  const options = [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
  ];

  return (
    <div className="question-container">
      <div className="question-card">
        <h1>{examTitle}</h1>

        <p>
          Question {currentQuestion + 1} of {questions.length}
        </p>

        <div className="question-progress">
          <div
            className="question-progress-fill"
            style={{
              width: `${
                ((currentQuestion + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>

        <h3>{question.questionText}</h3>

        <div className="options-container">
          {options.map((option) => (
            <label className="option" key={option.key}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.key}
                checked={selectedAnswers[question.id] === option.key}
                onChange={() =>
                  setSelectedAnswers((previousAnswers) => ({
                    ...previousAnswers,
                    [question.id]: option.key,
                  }))
                }
              />

              <span>
                {option.key}. {option.text}
              </span>
            </label>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="question-buttons">
          <button
            disabled={currentQuestion === 0 || submitting}
            onClick={() =>
              setCurrentQuestion((previous) => previous - 1)
            }
          >
            Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              disabled={submitting}
              onClick={() =>
                setCurrentQuestion((previous) => previous + 1)
              }
            >
              Next
            </button>
          ) : (
            <button disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Questions;
