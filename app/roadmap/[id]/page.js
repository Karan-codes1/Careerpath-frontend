'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import MilestoneCard from '@/components/MilestoneCard';

export default function RoadmapDetailPage() {
    const { id } = useParams(); // get :id from URL
    const router = useRouter();
    const { isLoggedIn, setIsLoggedIn } = useAuth(); // access isLoggedIn
    const [milestones, setMilestones] = useState([]);
    const [roadmap, setRoadmap] = useState(null);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    useEffect(() => {
        if (isLoggedIn === false) {
            // User is not logged in, redirect to login page
             router.push('/login?message=login_required');
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const fetchRoadmapDetails = async () => {
            try {
                const res = await api.get(`/roadmap/${id}`); 
                setRoadmap(res.data.roadmap);
                setMilestones(res.data.milestones);
            } catch (error) {
                console.error('Error fetching roadmap details:', error);
            }
        };

        if (id && isLoggedIn) fetchRoadmapDetails();
    }, [id, isLoggedIn]);

    if (isLoggedIn === false || !roadmap) {
        return (
            <div className="text-center mt-10">
                {showLoginPopup && (
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded shadow-lg z-50 transition-all">
                        Please login or create an account to access the roadmap.
                    </div>
                )}
                <div>Loading...</div>
            </div>
        );
    }


 return (
  <div className="p-6 max-w-3xl mx-auto">
    <h1 className="text-3xl font-bold mb-2 text-center">{roadmap?.title}</h1>

    {/* Roadmap Description */}
    {roadmap?.description && (
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
        {roadmap.description}
      </p>
    )}

    <div className="space-y-8 py-4">
      {milestones.map((milestone) => (
        <MilestoneCard key={milestone._id} milestone={milestone} />
      ))}
    </div>
  </div>
);
};