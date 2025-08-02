'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import api from '@/utils/api';

export default function MilestoneCard({ milestone }) {
  const [expanded, setExpanded] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');

  const toggleExpand = async () => {
    if (!expanded && resources.length === 0) {
      setLoading(true);
      try {
        const res = await api.get(`/resource/milestone/${milestone._id}`);
        setResources(res.data.resources.slice(0, 3));
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
      setLoading(false);
    }

    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (contentRef.current) {
      if (expanded) {
        setHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setHeight('0px');
      }
    }
  }, [expanded, resources]);

  return (
    <div className="max-w-2xl w-full">
      {/* Milestone card */}
      <div
        onClick={toggleExpand}
        className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition cursor-pointer"
      >
        <div className="w-3 h-3 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
          <p className="text-sm text-gray-600">{milestone.description}</p>
        </div>
      </div>

      {/* Smooth expanding panel */}
      <div
        style={{
          maxHeight: height,
          transition: 'max-height 0.5s ease',
        }}
        className="ml-6 overflow-hidden mt-2"
        ref={contentRef}
      >
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          {loading ? (
            <p className="text-sm text-gray-500">Loading resources...</p>
          ) : (
            <>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Top Resources:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {resources.map((res) => (
                  <li key={res._id}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {res.title}
                    </a>
                    <span className="ml-2 text-xs text-gray-500">({res.type})</span>
                  </li>
                ))}
                {resources.length === 0 && (
                  <li className="text-sm text-gray-500">No resources yet for this milestone.</li>
                )}
              </ul>
              <Link
                href={`/resource/milestone/${milestone._id}`}
                className="inline-block mt-3 text-sm text-blue-600 hover:underline"
              >
                View All Resources →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
