import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Clock, Users, ArrowRight, Link as LinkIcon } from "lucide-react"; // import Link from "next/link";
import Router from "next/router";

export default function RoadmapCard({
  _id,
  title,
  description,
  icon,
  duration,
  difficulty,
  learners,
  skills,
}) {

  const router = useRouter(); // ✅ initialize router
 
  const getDifficultyColor = (level) => {
    if (typeof level !== "string") return "bg-gray-100 text-gray-800";
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
            {icon}
          </div>
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty || "Unknown"}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg group-hover:text-primary transition-colors">
          {title || "Untitled"}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {description || "No description available."}
        </CardDescription>
      </CardHeader>

      {/* ✅ Make CardContent grow and stretch */}
      <CardContent className="flex flex-col justify-between flex-grow px-4 pb-4">
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{(learners?.toLocaleString?.() ?? 0)} learners</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(skills || []).slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs border bg-gray-200 border-gray-300 rounded-full px-2 py-0.5"
              >
                {skill}
              </Badge>
            ))}
            {(skills?.length || 0) > 3 && (
              <Badge
                variant="secondary"
                className="text-xs border bg-gray-200 border-gray-300 rounded-full px-2 py-0.5"
              >
                +{skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        
          <button onClick={()=>{router.push(`/roadmap/${_id}`)}}
            className=" max-h-1 w-full flex items-center justify-center gap-2 text-white px-3 pb-5 rounded-md text-sm hover:bg-blue-700 transition-all"
            style={{ backgroundColor: "#030213" }}
          >
            Start Learning
            <ArrowRight className="w-4 h-4" />
          </button>

     
      </CardContent>
    </Card>
  );
}
