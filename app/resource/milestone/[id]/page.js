'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ViewAllResources() {
  const { id } = useParams();
  const router = useRouter(); // for redirection
  const { isLoggedIn } = useAuth(); // access auth status

  const [resources, setresources] = useState([]);
  const [loading, setloading] = useState(true);
  const [milestone, setmilestone] = useState(null);

  useEffect(() => {
    // If not logged in then redirect to homepage
    if (!isLoggedIn) {
      router.push('/');
      return; // prevents further execution
    }

    const fetchResources = async () => {
      try {
        const res = await api.get(`/resource/milestone/${id}`);
        setmilestone(res.data.milestone);
        setresources(res.data.resources);
      } catch (error) {
        console.error('Error fetching full resource list:', error);
      }
      setloading(false);
    };

    fetchResources();
  }, [id, isLoggedIn, router]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading ? (
        <p className="mt-4 text-gray-500">Loading resources...</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
            {milestone?.title || 'Milestone Resources'}
          </h1>
          <p className="text-gray-600 mb-4">{milestone?.description}</p>

          {resources.length === 0 ? (
            <p className="text-gray-500">No resources available for this milestone yet.</p>
          ) : (
            <ul className="space-y-3">
              {resources.map((res) => (
                <li
                  key={res._id}
                  className="bg-white border border-gray-200 p-4 rounded-md shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 font-medium hover:underline"
                    >
                      {res.title}
                    </a>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {res.type}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
