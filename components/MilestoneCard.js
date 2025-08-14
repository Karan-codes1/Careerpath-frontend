'use client'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar } from 'lucide-react'
import { CheckCircle, Circle, Lock } from 'lucide-react'

export function StatusIcon({ status, onClick }) {
  const baseClasses = "w-6 h-6"
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
    <Badge className={variants[status]}>
      {formattedStatus}
    </Badge>
  )
}

import { Progress } from '@/components/ui/progress'

export default function MilestoneCard({ milestone, index, onComplete, onDelete, onOpen }) {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${milestone.status === 'locked' ? 'opacity-60' : 'cursor-pointer'}`}
      onClick={() => {
        if (milestone.status !== 'locked') {
          onOpen(milestone._id)
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="flex-shrink-0 mt-1">
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
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <CardTitle className="text-lg mb-1">
                  {index + 1}. {milestone.title}
                </CardTitle>
                <CardDescription>{milestone.description}</CardDescription>
              </div>
              <StatusBadge status={milestone.status} />
            </div>

            {/* Details */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {milestone.duration}
              </div>
              {milestone.completionDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Completed {new Date(milestone.completionDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Progress Bar if in progress */}
            {milestone.status === 'in-progress' && milestone.progress && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm">{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
