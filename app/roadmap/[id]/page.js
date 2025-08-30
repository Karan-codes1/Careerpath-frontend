'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/utils/api'
import MilestoneCard from '@/components/MilestoneCard'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, CheckCircle, Circle, Clock, Trophy, Users, Calendar, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function RoadmapDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [remainingMilestones, setRemainingMilestones] = useState(0)
  const [completedMilestones, setCompletedMilestones] = useState(0)
  const [progress, setProgress] = useState(0)
  const [roadmap, setRoadmap] = useState(null)
  const [milestones, setMilestones] = useState([])

  // Navigate to AI Project Ideas page
  const handleGetProjectIdeas = () => {
    if (!roadmap?.title) return
    router.push(`/projects?roadmapName=${encodeURIComponent(roadmap.title)}`)
  }

   useEffect(() => {
    if (isLoggedIn === false) {
      router.push("/login?message=login_required");
    }
  }, [isLoggedIn, router]);

  const handleMilestoneComplete = async (milestoneId) => {
    if (!id) return console.error("Missing roadmap ID.")

    try {
      await api.put(`/roadmap/${id}`, {
        milestoneId,
        status: "completed",
      })

      const [milestonesRes, progressRes] = await Promise.all([
        api.get(`/roadmap/${id}`),
        api.get(`/roadmap/${id}/progress`)
      ])

      setMilestones(milestonesRes.data.milestones)
      setProgress(progressRes.data.progressPercentage)
      setRemainingMilestones(progressRes.data.remainingMilestones)
      setCompletedMilestones(progressRes.data.completedMilestones)
    } catch (err) {
      console.error("Error updating milestone:", err)
    }
  }

  const handleMilestoneDelete = async (milestoneId) => {
    if (!id) return console.error("Missing roadmap ID.")

    try {
      await api.delete(`/roadmap/${id}`, { data: { milestoneid: milestoneId } })

      const [milestonesRes, progressRes] = await Promise.all([
        api.get(`/roadmap/${id}`),
        api.get(`/roadmap/${id}/progress`)
      ])

      setMilestones(milestonesRes.data.milestones)
      setProgress(progressRes.data.progressPercentage)
      setRemainingMilestones(progressRes.data.remainingMilestones)
      setCompletedMilestones(progressRes.data.completedMilestones)
    } catch (error) {
      console.error("Error deleting milestone:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/roadmap/${id}`)
        setRoadmap(res.data.roadmap)
        setMilestones(res.data.milestones)

        const progressRes = await api.get(`/roadmap/${id}/progress`)
        setProgress(progressRes.data.progressPercentage)
        setRemainingMilestones(progressRes.data.remainingMilestones)
        setCompletedMilestones(progressRes.data.completedMilestones)
      } catch (error) {
        console.error('Error fetching roadmap details:', error)
      }
    }

    if (id && isLoggedIn) fetchData()
  }, [id, isLoggedIn])

  if (!isLoggedIn || !roadmap) {
    return (
      <div className="text-center mt-10">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-6 ml-9">
            <button
              onClick={() => router.push('/?message=GetToRoadmaps')}
              className="flex items-center gap-2 text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmaps
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="mb-2 text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text underline underline-offset-4 decoration-indigo-300">
                    {roadmap.title}
                  </h1>
                  <p className="text-gray-600 mb-4">{roadmap.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {roadmap.skills.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 rounded-lg"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-sm text-gray-500">Duration</div>
                  <div>{roadmap.duration}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-sm text-gray-500">Difficulty</div>
                  <div>{roadmap.difficulty}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-sm text-gray-500">Enrolled</div>
                  <div>{roadmap.learners.toLocaleString()}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-sm text-gray-500">Success Rate</div>
                  <div>{roadmap.completionRate}%</div>
                </div>
              </div>

              {/* AI Project Ideas Button */}
              <button
                onClick={handleGetProjectIdeas}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg"
              >
                <Sparkles className="w-4 h-4" />
                Get AI Project Ideas
              </button>
            </div>

            {/* Progress Card */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>
                    {progress === 0
                      ? "Let's get started! "
                      : progress === 100
                        ? '🎉 You’ve completed the roadmap. Great job!'
                        : "Keep going! You're doing great."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Overall Progress</span>
                        <span className="text-sm">{progress}%</span>
                      </div>
                      <Progress className="bg-black h-3" value={progress} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div>{completedMilestones}</div>
                        <div className="text-sm text-gray-500">Completed</div>
                      </div>
                      <div>
                        <div>{remainingMilestones}</div>
                        <div className="text-sm text-gray-500">Remaining</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-semibold">Milestones</h2>
          <Badge variant="outline">{milestones.length} steps</Badge>
        </div>

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone._id}
              milestone={milestone}
              index={index}
              onComplete={handleMilestoneComplete}
              onDelete={handleMilestoneDelete}
              onOpen={(id) => router.push(`/resource/milestone/${id}`)}
            />
          ))}
        </div>
      </div>

     {/* Take the Quiz CTA */}
{/* Take the Quiz CTA */}
<div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center text-center">
  <p className="text-2xl font-bold text-gray-800 mb-4">
    Ready to test your skills? Take the quiz now!
  </p>
  <Link href={`/quiz/${id}`}>
    <Button
      className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
    >
      Take the Quiz
    </Button>
  </Link>
</div>


    </div>
  )
}
