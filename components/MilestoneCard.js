'use client'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { CheckCircle, Circle, Lock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

// --- Status Icon ---
export function StatusIcon({ status, onClick }) {
  const baseClasses = "w-4 h-4 sm:w-5 sm:h-5" 
  const isClickable = typeof onClick === 'function'
  const iconProps = {
    className: `${baseClasses} ${isClickable ? 'cursor-pointer' : ''}`,
    onClick,
  }

  switch (status) {
    case 'completed':
      return <CheckCircle {...iconProps} className={`${baseClasses} text-green-500`} />
    case 'in_progress':
      return <Clock {...iconProps} className={`${baseClasses} text-blue-500`} />
    case 'not_started':
      return <Circle {...iconProps} className={`${baseClasses} text-indigo-500`} />
    case 'locked':
      return <Lock className={`${baseClasses} text-gray-400`} />
    default:
      return <Circle {...iconProps} className={`${baseClasses} text-gray-300`} />
  }
}

// --- Status Badge ---
export function StatusBadge({ status }) {
  const variants = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    locked: 'bg-gray-100 text-gray-500',
    not_started: 'bg-indigo-100 text-indigo-700',
  }

  const formattedStatus =
    status === 'in_progress'
      ? 'In Progress'
      : status === 'not_started'
      ? 'Start Now'
      : typeof status === 'string'
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : 'Unknown'

  return (
    <Badge
      className={`
        ${variants[status]}
        text-[9px] sm:text-[10px] md:text-xs
        py-0.5 px-1 sm:py-0.5 sm:px-1.5 md:py-1 md:px-2
        rounded-md
      `}
    >
      {formattedStatus}
    </Badge>
  )
}

// --- Milestone Card ---
export default function MilestoneCard({ milestone, index, onComplete, onDelete, onOpen }) {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        milestone.status === 'locked' ? 'opacity-60' : 'cursor-pointer'
      } p-2 sm:p-3 md:p-3`}
      onClick={() => {
        if (milestone.status !== 'locked') {
          onOpen(milestone._id)
        }
      }}
    >
      <CardHeader className="p-0">
        {/* ✅ Changed layout: inline on phone, stacked on larger screens */}
        <div className="flex flex-row sm:flex-row sm:items-start gap-2 sm:gap-3">
          
          {/* Status Icon */}
          <div className="flex-shrink-0 flex items-center">
            <StatusIcon
              status={milestone.status}
              onClick={(e) => {
                e.stopPropagation()
                if (milestone.status === 'completed') {
                  onDelete(milestone._id)
                } else if (milestone.status !== 'locked') {
                  onComplete(milestone._id)
                }
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 sm:mb-2">
              <div>
                {/* Title aligned with icon */}
                <CardTitle className="text-sm sm:text-base md:text-base mb-0.5">
                  {index + 1}. {milestone.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-sm text-gray-600">
                  {milestone.description}
                </CardDescription>
              </div>
              <div className="mt-1 sm:mt-0">
                <StatusBadge status={milestone.status} />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {milestone.duration}
              </div>
            </div>

            {/* Progress */}
            {milestone.status === 'in_progress' && milestone.progress && (
              <div className="mt-1 sm:mt-2">
                <div className="flex justify-between mb-1 text-xs sm:text-sm">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-1.5 sm:h-2" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
