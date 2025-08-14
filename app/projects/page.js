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


// const newprojects = [
//   {
//     title: "Personal Blog API",
//     description: "Create a RESTful API for a personal blog that allows users to create, read, update, and delete blog posts.",
//     requiredSkills: ["Node.js", "Express", "MongoDB"],
//     keyFeatures: [
//       "CRUD operations for posts",
//       "User authentication",
//       "Commenting system"
//     ],
//     difficulty: "Beginner",
//     duration: "4-6 weeks"
//   },
//   {
//     title: "E-commerce Backend",
//     description: "Develop a backend service for an e-commerce platform that handles product listings, user accounts, and orders.",
//     requiredSkills: ["Node.js", "Express", "MongoDB", "JWT"],
//     keyFeatures: [
//       "Product management",
//       "User authentication and authorization",
//       "Order processing"
//     ],
//     difficulty: "Intermediate",
//     duration: "6-8 weeks"
//   },
//   {
//     title: "Real-time Chat Application",
//     description: "Build a real-time chat application with features like private messaging, group chats, and message history.",
//     requiredSkills: ["Node.js", "Socket.io", "MongoDB", "Redis"],
//     keyFeatures: [
//       "Real-time messaging",
//       "User presence indicators",
//       "Message storage and retrieval"
//     ],
//     difficulty: "Advanced",
//     duration: "8-10 weeks"
//   }
// ];




export default function RoadmapProjects() {
  const searchParams = useSearchParams();
  const roadmapName = searchParams.get("roadmapName") || "";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [projects, setProjects] = useState(newprojects);
  const [difficulty, setDifficulty] = useState("Mixed"); // new state

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

  // Filter projects locally if using static data
  const filteredProjects =
    difficulty === "Mixed"
      ? projects
      : projects.filter((p) => p.difficulty === difficulty);


  return (
    <div className="p-4">

      <div className="mb-6 p-6 mx-10 my-5 bg-gray-800 text-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{roadmapName || "Roadmap"}</h1>
        <p className="text-lg opacity-90">
          Explore carefully crafted project ideas to reinforce the skills from this roadmap.
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">Difficulty: {difficulty}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">{filteredProjects.length} Project Ideas</span>
        </div>
      </div>



      <div className="flex justify-center items-center gap-4 mb-6">
        {/* Difficulty Selector */}
       <div className="relative inline-block w-60">
  <div className="w-60">
    <Select value={difficulty} onValueChange={setDifficulty}>
      <SelectTrigger
        className="
          bg-gray-800 text-white w-full rounded-lg border border-gray-300 
          h-14 flex items-center px-4
        "
        style={{ minHeight: "41px" }} // Ensure min height if needed
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
</div>


        {/* Generate Button */}
        <button
          onClick={fetchProjects}
          disabled={loading}
          className="text-white px-4 py-2 rounded-lg bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Project Ideas"}
        </button>
      </div>


      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Empty State */}
      {!loading && projects.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-400">
          <img
            src="/undraw_chat-with-ai_ir62.svg" // <-- your gif or image path here
            alt="Waiting for projects"
            className="w-64 h-64 object-contain mb-4"
          />
          <p className="text-lg">Click "Generate Project Ideas" to get started!</p>
        </div>
      )}


      {/* Projects Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {filteredProjects.map((project, index) => (
          <div key={index} className="w-full max-w-sm mx-auto">
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
