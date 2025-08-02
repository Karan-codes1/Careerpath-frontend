'use client'
import Link from 'next/link';

export default function RoadmapCard({ roadmap }) {
  return (
    <Link href={`/roadmap/${roadmap._id}`}>
    <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition max-w-md w-full">
        <h2 className="text-xl font-semibold">{roadmap.title}</h2>
        <p className="text-gray-600">{roadmap.description}</p>
      </div>
    </Link>
  );
}
