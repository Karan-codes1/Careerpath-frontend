'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import {
  Code,
  Palette,
  Database,
  Smartphone,
  Brain,
  TrendingUp,
  Shield,
  Cloud,
  Globe,
  Zap,
  Target,
  Briefcase,
  Layers,
  BarChart2,
} from "lucide-react";

const iconMap = {
  code: Code,
  palette: Palette,
  database: Database,
  smartphone: Smartphone,
  brain: Brain,
  trendingup: TrendingUp,
  shield: Shield,
  cloud: Cloud,
  globe: Globe,
  zap: Zap,
  target: Target,
  briefcase: Briefcase,
  layers: Layers,
  barchart2: BarChart2,
};
import RoadmapCard from '@/components/RoadmapCard';
import { useSearchParams } from 'next/navigation';


export default function DashboardPage() {


  const roadmapSectionRef = useRef(null);
  const searchParams = useSearchParams();
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "GetToRoadmaps" && roadmapSectionRef.current) {
      roadmapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

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
    <>
      <section className="text-center py-20 bg-white">
        {/* <div className="mb-2 text-yellow-500 text-sm flex justify-center items-center gap-1">
    ⭐⭐⭐⭐⭐ <span className="text-gray-600">Trusted by 50k+ learners</span>
  </div> */}

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your Journey to a <br /> Successful Career Starts Here
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Discover curated learning roadmaps designed by industry experts. Get step-by-step guidance to master in-demand skills and land your dream job.
        </p>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => roadmapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#030213] hover:bg-black text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-1"
          >
            Explore Roadmaps ⏷
          </button>

        </div>

        <div className="flex justify-center gap-10 text-center text-gray-700 border-t pt-6 max-w-xl mx-auto">
          <div>
            <p className="text-2xl font-semibold">50+</p>
            <p className="text-sm">Career Roadmaps</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">500+</p>
            <p className="text-sm">Learning Resources</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">95%</p>
            <p className="text-sm">Success Rate</p>
          </div>
        </div>
      </section>



      <div className="min-h-screen bg-[#f4f7fa]">
        <div className="flex flex-col items-center px-4 py-12">
          {/* Heading */}
          <section className="text-center py-12 px-4 md:px-8 lg:px-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Choose Your Career Path
            </h2>
            <p ref={roadmapSectionRef} className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive collection of career roadmaps. Each path is carefully crafted to take you from beginner to professional level.
            </p>
          </section>


          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {roadmaps.length > 0 ? (
              roadmaps.map((roadmap) => {
                const IconComponent = iconMap[roadmap.icon?.toLowerCase()] || Code;

                return (
                  <Link
                    key={roadmap._id}
                    href={`/roadmap/${roadmap._id}`} 
                    className="hover:shadow-lg transition-shadow"
                  >
                    <RoadmapCard
                      {...roadmap}
                      icon={<IconComponent className="w-6 h-6" />}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-full mt-8">
                No roadmaps available.
              </p>
            )}
          </div>

        </div>
      </div>



      <section className="bg-gray-50 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of learners who have successfully transitioned to their dream careers with our structured roadmaps and expert guidance.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/login"
            className="bg-[#030213] hover:bg-black text-white px-6 py-2 rounded-md font-medium text-sm inline-block text-center"
          >
            Get Started for Free
          </Link>
          {/* <button className="border border-gray-300 hover:bg-gray-100 text-black px-6 py-2 rounded-md font-medium text-sm">
            View All Roadmaps
          </button> */}
        </div>
      </section>

    </>
  );
}
