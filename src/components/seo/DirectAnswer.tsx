import React from "react";

interface DirectAnswerProps {
  question: string;
  answer: string;
  sourceUrl?: string;
  sourceName?: string;
}

export function DirectAnswer({ question, answer, sourceUrl, sourceName }: DirectAnswerProps) {
  // 40-90 words recommendation for Answer blocks
  const wordCount = answer.split(" ").length;
  if (wordCount < 10 || wordCount > 100) {
    console.warn(`[SEO WARN] Direct Answer length for "${question}" is ${wordCount} words. Target is 40-90 words.`);
  }

  return (
    <div 
      className="direct-answer-block bg-blue-50 border-l-4 border-blue-600 p-4 my-6 rounded-r-md text-gray-800"
      itemScope 
      itemProp="mainEntity" 
      itemType="https://schema.org/Question"
    >
      <h2 itemProp="name" className="text-xl font-bold mb-2">{question}</h2>
      <div 
        itemScope 
        itemProp="acceptedAnswer" 
        itemType="https://schema.org/Answer"
      >
        <div itemProp="text" className="text-md leading-relaxed">
          {answer}
        </div>
        {sourceUrl && sourceName && (
          <div className="mt-3 text-sm text-gray-500">
            Kaynak: <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{sourceName}</a>
          </div>
        )}
      </div>
    </div>
  );
}
