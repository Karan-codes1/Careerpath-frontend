import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    Clock,
    BookOpen,
    Video,
    FileText,
    GraduationCap,
    ExternalLink,
} from "lucide-react";

export function ResourceItem({ resource }) {
    const resourceConfig = {
        video: { icon: Video, label: "Video" },
        article: { icon: FileText, label: "Article" },
        book: { icon: BookOpen, label: "Book" },
        course: { icon: GraduationCap, label: "Course" },
    };

    const getTypeColor = (type) => {
        if (typeof type !== "string") return "bg-gray-100 text-gray-800";
        switch (type.toLowerCase()) {
            case "video": return "bg-red-100 text-red-800";
            case "article": return "bg-blue-100 text-blue-800";
            case "book": return "bg-green-100 text-green-800";
            case "course": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getDifficultyColor = (difficulty) => {
        if (typeof difficulty !== "string") return "bg-gray-100 text-gray-800";
        switch (difficulty.toLowerCase()) {
            case "beginner": return "bg-green-100 text-green-800 ";
            case "intermediate": return "bg-yellow-100 text-yellow-800 ";
            case "advanced": return "bg-red-100 text-red-800 ";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const defaultConfig = { icon: FileText, label: "Unknown" };
    const config = resourceConfig[resource?.type?.toLowerCase()] || defaultConfig;
    const IconComponent = config.icon;
    const typeColorClass = getTypeColor(resource.type);
    const typeofdifficulty = getDifficultyColor(resource.difficulty);

    return (
        <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4">

                {/* Icon */}
                <div className={`p-2 rounded-md w-fit ${typeColorClass}`}>
                    <IconComponent className="w-5 h-5 text-inherit" />
                </div>

                <div className="flex-1 space-y-3">
                    {/* Step + Optional */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${typeColorClass}`}>
                            Step {resource.step}
                        </span>


                        {resource.isOptional && (
                            <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-300 bg-yellow-50">
                                Optional
                            </Badge>
                        )}
                    </div>

                    {/* Title & Type */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium leading-tight">
                            {resource.title || "Untitled"}
                        </h3>
                        <Badge className={typeColorClass}>
                            {resource.type || "Unknown"}
                        </Badge>
                    </div>

                    {/* Description */}
                    {resource.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {resource.description}
                        </p>
                    )}

                    {/* Author, Duration, Difficulty */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By {resource.author}</span>
                        {resource.duration && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{resource.duration}</span>
                                </div>
                            </>
                        )}
                        {resource.difficulty && (
                            <>
                                <span>•</span>
                                <Badge className={`text-xs rounded-md w-fit ${typeofdifficulty}`}>
                                    {resource.difficulty}
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Tags + Link */}
                    {(Array.isArray(resource.tags) && resource.tags.length > 0) || resource.url ? (
                        <div className="space-y-2">
                            {Array.isArray(resource.tags) && resource.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {resource.tags.map((tag, index) => (
                                        <Badge key={index} className="text-xs border border-gray-250">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            {resource.url && (
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium border rounded-md border-gray-300 hover:bg-gray-100 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-4 mr-2" />
                                    <span className="text-xs">View Resource</span>
                                </a>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </Card>
    );
}
