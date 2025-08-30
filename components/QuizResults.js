"use client"
import { useState } from "react"
import api from "@/utils/api" // axios instance
import { Trophy, CheckCircle, XCircle, Lightbulb, RotateCcw } from "lucide-react"

export default function QuizResults({ score, total, answers, questions, onRestart }) {
  const [aiExplanations, setAiExplanations] = useState({}) // { questionId: explanation }
  const [loading, setLoading] = useState({}) // { questionId: boolean }

  const fetchAIExplanation = async (q, userAnswer) => {
    try {
      setLoading(prev => ({ ...prev, [q._id]: true }))

      const res = await api.post("/ai/explanation", {
        question: q.question,
        correctAnswer: q.options[q.correctIndex],
        selectedAnswer: userAnswer !== null ? q.options[userAnswer] : "Not Answered"
      })

      setAiExplanations(prev => ({ ...prev, [q._id]: res.data.explanation }))
    } catch (err) {
      setAiExplanations(prev => ({ ...prev, [q._id]: "⚠️ Failed to fetch AI explanation." }))
    } finally {
      setLoading(prev => ({ ...prev, [q._id]: false }))
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow text-center w-[80%] lg:w-[80%]">
      {/* Results Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-2 w-fit">
          <Trophy className="w-10 h-10" />
          <h2 className="text-2xl font-bold">Quiz Results</h2>
          <p className="text-lg">
            You scored <span className="font-semibold">{score}</span> out of{" "}
            <span className="font-semibold">{total}</span>
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4 text-left">
        {questions.map((q, index) => {
          const userAnswerObj = answers.find(a => a.questionId === q._id)
          const userAnswer = userAnswerObj ? userAnswerObj.selected : null
          const isCorrect = userAnswer === q.correctIndex

          return (
            <div
              key={index}
              className="p-6 border rounded-lg bg-gray-50 shadow-sm w-full mx-auto"
            >
              <p className="font-medium mb-3">
                {index + 1}. {q.question}
              </p>

              {/* Correct / Wrong Answer Section */}
              {isCorrect && userAnswer !== null ? (
                <p className="flex items-center text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Correct Answer: {q.options[q.correctIndex]}
                </p>
              ) : (
                <>
                  <p className="flex items-center text-red-600 font-medium">
                    <XCircle className="w-4 h-4 mr-2" />
                    Your Answer:{" "}
                    {userAnswer !== null ? q.options[userAnswer] : "Not Answered"}
                  </p>
                  <p className="flex items-center text-green-600 font-medium mt-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Correct Answer: {q.options[q.correctIndex]}
                  </p>
                </>
              )}

              {/* Static Explanation */}
              {!aiExplanations[q._id] && q.explanation && (
                <div className="mt-3 bg-gray-100 border-l-4 border-indigo-500 p-3 rounded-md shadow-sm text-gray-700 text-sm">
                  <span className="font-semibold text-indigo-600">Explanation:</span>{" "}
                  {q.explanation}
                </div>
              )}

              {/* AI Explanation Section */}
              <div className="mt-3">
                <button
                  disabled={loading[q._id]}
                  onClick={() => fetchAIExplanation(q, userAnswer)}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 text-white text-sm font-medium 
                    ${loading[q._id] ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  <Lightbulb className="w-4 h-4" />
                  {loading[q._id] ? "Generating..." : "Get AI Explanation"}
                </button>

                {aiExplanations[q._id] && (
                  <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md shadow-sm text-blue-700 text-sm">
                    <span className="font-semibold text-blue-600 flex items-center gap-1 mb-1">
                      <Lightbulb className="w-4 h-4" /> AI Explanation:
                    </span>
                    {aiExplanations[q._id]}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Restart Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onRestart}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Restart Quiz
        </button>
      </div>
    </div>
  )
}
