"use client"
import { useState } from "react"
import api from "@/utils/api"
import { Trophy, CheckCircle, XCircle, Lightbulb, RotateCcw } from "lucide-react"

// --- Color Palette Variables (Based on your cohesive UI) ---
const PRIMARY_TEAL = "bg-teal-600 hover:bg-teal-700"
const PRIMARY_TEAL_LOAD = "bg-teal-400" // For loading state
const SUCCESS_GREEN = "text-emerald-600" // Muted, professional green
const ERROR_RED = "text-red-500" // Muted, professional red
const EXPLANATION_BORDER = "border-teal-500" // Border for static explanation
const AI_EXPLANATION_BG = "bg-blue-50 border-blue-400 text-blue-800"

export default function QuizResults({ score, total, answers, questions, onRestart }) {
  const [aiExplanations, setAiExplanations] = useState({})
  const [loading, setLoading] = useState({})

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
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl w-full 
             max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl 
             mx-auto lg:mx-0">

      {/* Results Header (Made more compact) */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 gap-3">
        {/* REDUCED PADDING: Changed p-4 sm:p-6 md:p-8 to p-3 sm:p-4 md:p-6 */}
        <div className={`bg-teal-600 text-white 
                 p-3 sm:p-4 md:p-6 rounded-xl shadow-lg flex flex-col items-center gap-1 w-full text-center`}>
          {/* REDUCED ICON SIZE: w-10 h-10 sm:w-12 sm:h-12 to w-8 h-8 sm:w-10 sm:h-10 */}
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          {/* REDUCED H2 SIZE: text-xl sm:text-2xl md:text-3xl to text-lg sm:text-xl md:text-2xl */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-wide">Quiz Result</h2>
          {/* REDUCED SCORE SIZE: text-xl sm:text-2xl md:text-3xl to text-xl sm:text-2xl md:text-3xl (kept bold emphasis) */}
          <p className="text-xl sm:text-2xl font-extrabold mt-1">
            {score} / {total}
          </p>
          {/* REDUCED MESSAGE SIZE: text-sm sm:text-base to text-xs sm:text-sm */}
          <p className="text-xs sm:text-sm opacity-90">
            {score === total
              ? "Perfect score! Outstanding work"
              : score > total * 0.5
                ? "Great job! Keep the momentum going"
                : "Review the answers and try again"}
          </p>
        </div>
      </div>

      {/* Questions List (No changes needed here for size reduction) */}
      <div className="space-y-4">
        {questions.map((q, index) => {
          const userAnswerObj = answers.find(a => a.questionId === q._id)
          const userAnswer = userAnswerObj ? userAnswerObj.selected : null
          const isCorrect = userAnswer === q.correctIndex
          const notAnswered = userAnswer === null

          return (
            <div
              key={index}
              className="p-4 md:p-6 border border-gray-200 rounded-lg shadow-md"
            >
              <p className="font-semibold mb-3 text-base md:text-lg text-gray-800">
                {index + 1}. {q.question}
              </p>

              {/* Your Answer Status */}
              <div className="text-sm md:text-base space-y-1">
                {isCorrect ? (
                  <p className={`flex items-start ${SUCCESS_GREEN} font-medium`}>
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    You answered correctly!
                  </p>
                ) : (
                  <>
                    <p className={`flex items-start ${ERROR_RED} font-medium`}>
                      <XCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      Your Answer: {notAnswered ? "Not Answered" : q.options[userAnswer]}
                    </p>
                    {/* Correct Answer (Shown only if the user was wrong/skipped) */}
                    <p className={`flex items-start ${SUCCESS_GREEN} font-medium`}>
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      Correct Answer: {q.options[q.correctIndex]}
                    </p>
                  </>
                )}
              </div>

              {/* Static Explanation */}
              {!aiExplanations[q._id] && q.explanation && (
                <div className={`mt-3 md:mt-4 bg-gray-50 border-l-4 ${EXPLANATION_BORDER} p-3 rounded-md text-gray-700 text-sm md:text-base`}>
                  <span className="font-semibold text-teal-700">Explanation:</span> {q.explanation}
                </div>
              )}

              {/* AI Explanation Button & Result */}
              <div className="mt-4 md:mt-5">
                <button
                  disabled={loading[q._id]}
                  onClick={() => fetchAIExplanation(q, userAnswer)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm md:text-base font-medium transition-colors
                    ${loading[q._id] ? PRIMARY_TEAL_LOAD : PRIMARY_TEAL}`}
                >
                  <Lightbulb className="w-4 h-4" />
                  {loading[q._id] ? "Generating..." : "Get AI Explanation"}
                </button>

                {aiExplanations[q._id] && (
                  <div className={`mt-3 ${AI_EXPLANATION_BG} border-l-4 p-3 rounded-md text-sm md:text-base`}>
                    <span className="font-bold flex items-center gap-1 mb-1">
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
      <div className="mt-8 md:mt-10 flex justify-center">
        <button
          onClick={onRestart}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg flex items-center gap-2 text-base md:text-lg font-semibold transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Restart Quiz
        </button>
      </div>
    </div>
  )
}