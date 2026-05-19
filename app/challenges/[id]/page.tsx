import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { CHALLENGES } from "@/lib/challenges";
import ChallengeView from "@/components/ChallengeView";

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challengeIndex = CHALLENGES.findIndex((c) => c.id === id);
  if (challengeIndex === -1) notFound();

  const challenge = CHALLENGES[challengeIndex];
  const prev = challengeIndex > 0 ? CHALLENGES[challengeIndex - 1] : null;
  const next = challengeIndex < CHALLENGES.length - 1 ? CHALLENGES[challengeIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <AppHeader right={
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold text-white bg-gradient-to-r ${challenge.difficultyColor}`}>
          {challenge.difficulty}
        </span>
      } />

      <ChallengeView
        challenge={challenge}
        challengeIndex={challengeIndex}
        totalChallenges={CHALLENGES.length}
        prevChallenge={prev}
        nextChallenge={next}
      />
    </div>
  );
}
