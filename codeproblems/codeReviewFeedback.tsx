// Build a CodeReviewFeedback componenet that tracks upvotes
// and downvotess for five code quality aspects:
// Readability, Perfomance, Security, Documentation, and Testing.

// Requirments:
// Each aspect to have a upvote and a downvote button.
// Initial count is 0 for both (useState(0))
// CLicking downvote increases downvote by one or clicking upvote increases upvote by one.
// Counts update immediatly on click in the UI.
// if I have time I want to add loading animations and obv err handling

import React, { useState } from "react";

//types

interface Aspect {
  name: string;
  upvotes: number;
  downvotes: number;
}

type VoteType = "upvote" | "downvote";
const INITIAL_ASPECTS: Aspect[] = [
  { name: "Readability", upvotes: 0, downvotes: 0 },
  { name: "Performance", upvotes: 0, downvotes: 0 },
  { name: "Security", upvotes: 0, downvotes: 0 },
  { name: "Documentation", upvotes: 0, downvotes: 0 },
  { name: "Testing", upvotes: 0, downvotes: 0 },
];

const CodeReviewFeedback: React.FC = () => {
  const [aspects, setAspects] = useState<Aspect[]>(INITIAL_ASPECTS);

  //event things

  const handleVote = (index: number, voteType: VoteType): void => {
    setAspects((prevAspects) =>
      prevAspects.map((aspect, i) => {
        if (i !== index) {
          return aspect;
        }
        return {
          ...aspect,
          upvotes: aspect.upvotes + (voteType === "upvote" ? 1 : 0),
          downvotes: aspect.downvotes + (voteType === "downvote" ? 1 : 0),
        };
      })
    );
  };

  //fancy renderings will add loading and err handling, I like fancy loading animation state

  return (
    <div className='code-review-feedback'>
      <h2>Code Review Feedback</h2>
      <div className='aspects-container'>
        {aspects.map((aspect, index) => (
          <div
            key={aspect.name}
            className='aspect-row'
            data-testid={`aspect-${aspect.name.toLowerCase()}`}
          >
            <span className='aspect-name'>{aspect.name}</span>
            <div className='vote-controls'>
              <button
                className='vote-btn upvote-btn'
                onClick={() => handleVote(index, "upvote")}
              >
                Upvote
              </button>
              <span
                key={`up-${aspect.upvotes}`}
                className='vote-count'
                data-testid={`upvote-count-${aspect.name.toLowerCase()}`}
              >
                {aspect.upvotes}
              </span>
              <button
                className='vote-btn downvote-btn'
                onClick={() => handleVote(index, "downvote")}
                data-testid={`downvote-btn-${aspect.name.toLowerCase()}`}
              >
                Downvote
              </button>
              <span
                key={`down-${aspect.downvotes}`}
                className='vote-count'
                data-testid={`downvote-count-${aspect.name.toLowerCase()}`}
              >
                {aspect.downvotes}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeReviewFeedback;
