import React, { useState } from 'react';

const questions = [
  {
    question: "She arrived ___ the airport ___ time.",
    options: ["on / in", "at / on", "in / at"],
    correct: "at / on",
  },
  {
    question: "The cat is hiding ___ the bed.",
    options: ["under", "on", "above"],
    correct: "under",
  },
  {
    question: "I will meet you ___ Monday ___ noon.",
    options: ["at / at", "on / at", "in / on"],
    correct: "on / at",
  },
  {
    question: "He jumped ___ the river without thinking.",
    options: ["into", "onto", "above"],
    correct: "into",
  },
  {
    question: "The picture is hanging ___ the wall.",
    options: ["over", "on", "in"],
    correct: "on",
  },
  {
    question: "He walked ___ the room silently.",
    options: ["into", "onto", "beside"],
    correct: "into",
  },
  {
    question: "They have been living here ___ 2010.",
    options: ["for", "since", "from"],
    correct: "since",
  },
  {
    question: "The keys are ___ my pocket.",
    options: ["in", "at", "on"],
    correct: "in",
  },
  {
    question: "We sat ___ the fire to keep warm.",
    options: ["beside", "above", "across"],
    correct: "beside",
  },
  {
    question: "He apologized ___ being late.",
    options: ["with", "for", "to"],
    correct: "for",
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleOptionChange = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    let total = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) total += 1;
    });
    setScore(total);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const q = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Prepositions Quiz</h1>

      {!submitted ? (
        <>
          <div className="mb-6">
            <p className="font-medium mb-2">
              {currentQuestion + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = answers[currentQuestion] === opt;
                return (
                  <label key={i} className={`block cursor-pointer ${isSelected ? 'font-semibold text-yellow-800' : 'text-gray-800'}`}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleOptionChange(opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 text-xl font-semibold text-green-600">
            ✅ You scored {score} out of {questions.length}
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-yellow-500">📋 Answer Summary</h2>
          <ol className="space-y-4 text-base">
            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correct;

              return (
                <li key={index} className="border p-4 rounded bg-gray-50">
                  <p className="font-medium mb-1">{index + 1}. {q.question}</p>
                  <p>
                    Your answer:{" "}
                    <span className={isCorrect ? "text-green-600 font-semibold" : "text-red-600"}>
                      {userAnswer || "No answer"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-green-600">
                      Correct answer: <strong>{q.correct}</strong>
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
};

export default Quiz;
