'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/utils/api";
import ProjectCard from "@/components/ProjectCard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function RoadmapProjects() {
  const searchParams = useSearchParams();
  const roadmapName = searchParams.get("roadmapName") || "";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("Mixed");

  const difficultyOptions = ["Mixed", "Beginner", "Intermediate", "Advanced"];

  const fetchProjects = async () => {
    if (!roadmapName) {
      setError("Roadmap name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Fetching projects for roadmap:", roadmapName);
      const res = await api.post("/ai/projects", {
        roadmapName,
        difficulty: difficulty !== "Mixed" ? difficulty : undefined
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching AI projects:", err);
      setError("Failed to generate project ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    difficulty === "Mixed"
      ? projects
      : projects.filter((p) => p.difficulty === difficulty);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-gray-800 text-white rounded-xl shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{roadmapName || "Roadmap"}</h1>
        <p className="text-base sm:text-lg opacity-90">
          Explore carefully crafted project ideas to reinforce the skills from this roadmap.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">Difficulty: {difficulty}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">{filteredProjects.length} Project Ideas</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 max-w-5xl mx-auto">
        {/* Difficulty Selector */}
        <div className="w-full sm:w-60">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger
              className="bg-gray-800 text-white w-full rounded-lg border border-gray-300 h-14 flex items-center px-4"
            >
              <SelectValue placeholder="Set Difficulty (Mixed)" />
            </SelectTrigger>

            <SelectContent className="bg-gray-800 text-white rounded-md shadow-lg border border-gray-900">
              {difficultyOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="cursor-pointer rounded-md px-4 py-2 hover:bg-gray-900 focus:bg-gray-900"
                >
                  {option === "Mixed" ? "Set Difficulty (Mixed)" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <button
          onClick={fetchProjects}
          disabled={loading}
          className="text-white px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? "Generating..." : "Generate Project Ideas"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      {/* Empty State */}
      {!loading && projects.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-400">
          <img
            src="/undraw_chat-with-ai_ir62.svg"
            alt="Waiting for projects"
            className="w-48 sm:w-64 h-48 sm:h-64 object-contain mb-4"
          />
          <p className="text-base sm:text-lg text-center">Click "Generate Project Ideas" to get started!</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredProjects.map((project, index) => (
          <div key={index} className="w-full">
            <ProjectCard
              title={project.title}
              description={project.description}
              requiredSkills={project.requiredSkills}
              keyFeatures={project.keyFeatures}
              difficulty={project.difficulty}
              duration={project.duration}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
