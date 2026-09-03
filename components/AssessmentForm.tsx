"use client";

import { useState, useTransition } from "react";
import { submitAssessment } from "@/app/assessment/actions";
import Magnetic from "@/components/Magnetic";

export type Question = {
  id: number;
  order_index: number;
  question_text: string;
  options: string[];
};

export default function AssessmentForm({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await submitAssessment(answers);
      } catch (err) {
        // redirect() throws internally on success — only real errors land here.
        if (err instanceof Error && err.message) {
          setError(err.message);
        }
      }
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {questions.map((q, qIndex) => (
        <fieldset key={q.id} className="border-t border-black/5 pt-6 dark:border-white/10">
          <legend className="text-base font-medium">
            {qIndex + 1}. {q.question_text}
          </legend>
          <div className="mt-4 flex flex-col gap-2">
            {q.options.map((option, optIndex) => (
              <label
                key={optIndex}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                  answers[q.id] === optIndex
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-black/10 hover:bg-black/[.02] dark:border-white/15 dark:hover:bg-white/[.04]"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  className="accent-indigo-600"
                  checked={answers[q.id] === optIndex}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: optIndex }))}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between border-t border-black/5 pt-6 dark:border-white/10">
        <p className="text-sm text-zinc-500">
          {answeredCount} / {questions.length} answered
        </p>
        <Magnetic>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isPending}
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {isPending ? "Submitting…" : "Submit assessment"}
          </button>
        </Magnetic>
      </div>
    </div>
  );
}
