import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS_DATA } from "@/lib/lessons";
import LessonView from "@/components/LessonView";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lesson: string }>;
}) {
  const { id, lesson } = await params;
  const level = LEVELS_DATA[id];
  if (!level) notFound();

  const lessonIndex = parseInt(lesson, 10);
  if (isNaN(lessonIndex) || lessonIndex < 0 || lessonIndex >= level.lessons.length) notFound();

  const currentLesson = level.lessons[lessonIndex];
  const prevLesson = lessonIndex > 0 ? level.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < level.lessons.length - 1 ? level.lessons[lessonIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-purple-100 dark:border-slate-700 sticky top-0 z-50">
        <div className="w-full px-6 py-3 flex items-center gap-2 flex-wrap">
          <Link
            href="/"
            className="text-gray-500 dark:text-slate-400 hover:text-purple-600 transition-colors text-sm font-medium"
          >
            Accueil
          </Link>
          <span className="text-gray-300 dark:text-slate-600">/</span>
          <Link
            href={`/levels/${level.id}`}
            className="text-gray-500 dark:text-slate-400 hover:text-purple-600 transition-colors text-sm font-medium flex items-center gap-1"
          >
            <span>{level.emoji}</span>
            <span>Niveau {level.id}</span>
          </Link>
          <span className="text-gray-300 dark:text-slate-600">/</span>
          <span className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-48">
            {currentLesson.title}
          </span>
        </div>
      </header>

      <LessonView
        levelId={level.id}
        levelColor={level.color}
        levelName={level.name}
        lessonIndex={lessonIndex}
        totalLessons={level.lessons.length}
        lesson={currentLesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    </div>
  );
}
