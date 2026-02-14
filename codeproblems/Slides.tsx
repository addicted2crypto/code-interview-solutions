// Build a Slides component that takes an array of slide objects (each with title and text). Users navigate with Next, Prev, and Restart buttons. Buttons disable at appropriate boundaries. 

import React, { useState } from "react";

interface Slide {
  title: string;
  text: string;
}

interface SlidesProps {
  slides: Slide[];
}

const Slides: React.FC<SlidesProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentSlide = slides[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;

  const handlePrev = (): void => {
    setCurrentIndex(prev => prev - 1);
  };

  const handleNext = (): void => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = (): void => {
    setCurrentIndex(0);
  };

  return (
    <div>
      <div id="navigation" className="text-center">
        <button
          data-testid="button-restart"
          className="small outlined"
          onClick={handleRestart}
          disabled={isFirst}
        >
          Restart
        </button>
        <button
          data-testid="button-prev"
          className="small"
          onClick={handlePrev}
          disabled={isFirst}
        >
          Prev
        </button>
        <button
          data-testid="button-next"
          className="small"
          onClick={handleNext}
          disabled={isLast}
        >
          Next
        </button>
      </div>
      <div id="slide" className="card text-center">
        <h1 data-testid="title">{currentSlide.title}</h1>
        <p data-testid="text">{currentSlide.text}</p>
      </div>
    </div>
  );
};

export default Slides;