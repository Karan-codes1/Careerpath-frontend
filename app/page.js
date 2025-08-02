// app/dashboard/page.js
'use client'
import { useEffect, useState } from 'react';
import api from '@/utils/api'
import RoadmapCard from '@/components/RoadmapCard';

export default function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await api.get('/roadmap');
        setRoadmaps(res.data.allroadmaps);
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      }
    };

    fetchRoadmaps();
  }, []);

  return (
     <div className="min-h-screen bg-[#f4f7fa]">
     <div className="flex flex-col items-center px-4 py-12">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-600 mb-6 mt-4">Roadmaps</h1>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl w-full">
        {roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap._id} roadmap={roadmap} />
        ))}
      </div>
    </div>
    </div>
  );
}
