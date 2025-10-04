'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import api from '@/utils/api'
import { useAuth } from '@/context/AuthContext'
// Changed icon size from default w-6 h-6 to w-5 h-5 for smaller screens
import { Clock, Trophy, Users, CheckCircle, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// ✅ Lazy load heavy milestone cards
const MilestoneCard = dynamic(() => import('@/components/MilestoneCard'), {
  loading: () => (
    <div className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
  ),
  ssr: false,
})

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
      router.push('/login?message=login_required')
    }
  }, [isLoggedIn, router])

  const handleMilestoneComplete = async (milestoneId) => {
    if (!id) return console.error('Missing roadmap ID.')

    try {
      await api.put(`/roadmap/${id}`, {
        milestoneId,
        status: 'completed',
      })

      const [milestonesRes, progressRes] = await Promise.all([
        api.get(`/roadmap/${id}`),
        api.get(`/roadmap/${id}/progress`),
      ])

      setMilestones(milestonesRes.data.milestones)
      setProgress(progressRes.data.progressPercentage)
      setRemainingMilestones(progressRes.data.remainingMilestones)
      setCompletedMilestones(progressRes.data.completedMilestones)
    } catch (err) {
      console.error('Error updating milestone:', err)
    }
  }

  const handleMilestoneDelete = async (milestoneId) => {
    if (!id) return console.error('Missing roadmap ID.')

    try {
      await api.delete(`/roadmap/${id}`, { data: { milestoneid: milestoneId } })

      const [milestonesRes, progressRes] = await Promise.all([
        api.get(`/roadmap/${id}`),
        api.get(`/roadmap/${id}/progress`),
      ])

      setMilestones(milestonesRes.data.milestones)
      setProgress(progressRes.data.progressPercentage)
      setRemainingMilestones(progressRes.data.remainingMilestones)
      setCompletedMilestones(progressRes.data.completedMilestones)
    } catch (error) {
      console.error('Error deleting milestone:', error)
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

  // Memoize rendering for skills + milestones
  const skillBadges = useMemo(
    () =>
      roadmap?.skills.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="bg-gray-100 rounded-lg text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1" // Reduced badge size
        >
          {tag}
        </Badge>
      )),
    [roadmap?.skills]
  )

  const milestoneList = useMemo(
    () =>
      milestones.map((milestone, index) => (
        <MilestoneCard
          key={milestone._id}
          milestone={milestone}
          index={index}
          onComplete={handleMilestoneComplete}
          onDelete={handleMilestoneDelete}
          onOpen={(id) => router.push(`/resource/milestone/${id}`)}
        />
      )),
    [milestones]
  )

  if (!isLoggedIn || !roadmap) {
    return (
      // Added a small padding reduction for mobile if necessary
      <div className="text-center mt-6 sm:mt-10">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        {/* Reduced vertical padding on mobile (py-3) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div>
                  {/* Reduced title size on mobile (text-2xl) */}
                  <h1 className="mb-1 sm:mb-2 text-2xl sm:text-4xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text underline underline-offset-4 decoration-[#339999]">
                    {roadmap.title}
                  </h1>
                  {/* Reduced description size on mobile (text-sm) */}
                  <p className="text-gray-600 mb-3 text-sm sm:text-base sm:mb-4">{roadmap.description}</p>
                </div>
              </div>

              {/* Reduced margin and gap on mobile (mb-4, gap-1) */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">{skillBadges}</div>

              {/* Reduced margin and padding on mobile (gap-2, p-3) and font size (text-xs/sm) */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  {/* Reduced icon size on mobile (w-5 h-5) */}
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-blue-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Duration</div>
                  <div className="text-sm sm:text-base">{roadmap.duration}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  {/* Reduced icon size on mobile (w-5 h-5) */}
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-yellow-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Difficulty</div>
                  <div className="text-sm sm:text-base">{roadmap.difficulty}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  {/* Reduced icon size on mobile (w-5 h-5) */}
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-green-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Enrolled</div>
                  <div className="text-sm sm:text-base">{roadmap.learners.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  {/* Reduced icon size on mobile (w-5 h-5) */}
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-purple-500" />
                  <div className="text-xs sm:text-sm text-gray-500">Success Rate</div>
                  <div className="text-sm sm:text-base">{roadmap.completionRate}%</div>
                </div>
              </div>

              {/* AI Project Ideas Button - Reduced icon size, padding, and text size */}
              <button
                onClick={handleGetProjectIdeas}
                className="flex items-center gap-1 sm:gap-2 bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Get AI Project Ideas
              </button>
            </div>

            {/* Progress Card - Reduced padding/spacing in CardContent */}
            <div>
              <Card>
                <CardHeader className="py-3 sm:py-6">
                 
                  <CardTitle className="text-lg sm:text-xl">Your Progress</CardTitle>
                  
                  <CardDescription className="text-sm">
                    {progress === 0
                      ? "Let's get started! "
                      : progress === 100
                      ? 'You’ve completed the roadmap. Great job!'
                      : "Keep going! You're doing great."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 sm:pt-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm">Overall Progress</span>
                        <span className="text-xs sm:text-sm">{progress}%</span>
                      </div>
                      <Progress className="bg-black h-2 sm:h-3" value={progress+0.5} /> 
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                      <div>
                        <div className="text-lg sm:text-xl text-green-500">{completedMilestones}</div> {/* Reduced count size */}
                        <div className="text-xs sm:text-sm text-green-500 font-semibold">
                          Completed
                        </div>
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl text-gray-500">{remainingMilestones}</div> {/* Reduced count size */}
                        <div className="text-xs sm:text-sm text-gray-500">Remaining</div>
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
      {/* Reduced vertical padding (py-6) and spacing */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Milestones</h2> {/* Reduced heading size */}
          <Badge variant="outline" className="text-xs sm:text-sm">{milestones.length} steps</Badge> {/* Reduced badge size */}
        </div>

        <div className="space-y-4 sm:space-y-6">{milestoneList}</div> {/* Reduced vertical spacing */}
      </div>

      {/* Take the Quiz CTA */}
      {/* Reduced vertical padding (py-6) and text/button size */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center text-center">
        <p className="text-base sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
          Ready to test your skills? Take the quiz now!
        </p>
        <Link href={`/quiz/${id}`}>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold transition">
            Take the Quiz
          </Button>
        </Link>
      </div>
    </div>
  )
}