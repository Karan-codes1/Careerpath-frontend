import { create } from 'zustand'
import api from '@/utils/api'

export const RoadmapDetailsStore = create((set, get) => ({
  roadmapData: {}, // cache roadmap details by ID
  loading: false,

  // ✅ Fetch roadmap details (with progress)
  fetchRoadmapDetails: async (id) => {
    const { roadmapData, loading } = get()
    if (roadmapData[id] || loading) return

    set({ loading: true })

    try {
      const [res, progressRes] = await Promise.all([
        api.get(`/roadmap/${id}`),
        api.get(`/roadmap/${id}/progress`),
      ])

      set((state) => ({
        roadmapData: {
          ...state.roadmapData,
          [id]: {
            roadmap: res?.data?.roadmap || null,
            milestones: Array.isArray(res?.data?.milestones)
              ? res.data.milestones
              : [],
            progress: progressRes?.data || {
              progressPercentage: 0,
              completedMilestones: 0,
              remainingMilestones: 0,
            },
            lastFetched: Date.now(),
          },
        },
      }))
    } catch (err) {
      console.error('Error fetching roadmap details:', err)
    } finally {
      set({ loading: false })
    }
  },

  // ✅ Manually update cached data (used after local changes)
  setRoadmapData: (id, updatedData) =>
    set((state) => ({
      roadmapData: {
        ...state.roadmapData,
        [id]: {
          ...(state.roadmapData[id] || {}),
          ...updatedData,
        },
      },
    })),

  // ✅ Force refresh (always refetch)
  refetchRoadmapDetails: async (id) => {
    set({ loading: true })

    try {
      const [res, progressRes] = await Promise.all([
        api.get(`/roadmap/${id}`),
        api.get(`/roadmap/${id}/progress`),
      ])

      set((state) => ({
        roadmapData: {
          ...state.roadmapData,
          [id]: {
            roadmap: res?.data?.roadmap || null,
            milestones: Array.isArray(res?.data?.milestones)
              ? res.data.milestones
              : [],
            progress: progressRes?.data || {
              progressPercentage: 0,
              completedMilestones: 0,
              remainingMilestones: 0,
            },
            lastFetched: Date.now(),
          },
        },
      }))
    } catch (err) {
      console.error('Error refetching roadmap details:', err)
    } finally {
      set({ loading: false })
    }
  },
}))
