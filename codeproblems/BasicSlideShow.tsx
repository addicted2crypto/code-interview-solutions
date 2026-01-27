// Create a react component called basic slideshow that displays a series
// of slides and allows users to navigate through them.
//

// Requirements:
// The slides component takes an array of slides as a prop.
// Each slide is an object with title: string and text: string.
// on load display the first slide, next shows next unless at the end,
// prev shows prev unless at the start.
// Restart... well restarts to the first slide.

// diat-testid attributes:
// button-restart
// button-prev
// button-next

import React, { useState } from "react";

//types

interface Slide {
  title: string;
  text: string;
}

interface Props {
  slides: Slide[];
}

const slides: React.FC<Props> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = slides[currentIndex];
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === slides.length - 1;

  const handlePrev = (): void => setCurrentIndex((prev) => prev - 1);
  const handleNext = (): void => setCurrentIndex((prev) => prev + 1);
  const handleRestart = (): void => setCurrentIndex(0);

  return (
    <div>
      <h1 data-testid='title'>{currentSlide.title}</h1>
      <p data-testid='text'>{currentSlide.text}</p>
      <button
        data-testid='button-prev'
        onClick={handleRestart}
        disabled={isFirstSlide}
      >
        Restart
      </button>
      <button
        data-testid='button-prev'
        onClick={handlePrev}
        disabled={isFirstSlide}
      >
        Prev
      </button>
      <button
        data-testid='button-next'
        onClick={handleNext}
        disabled={isLastSlide}
      >
        Next
      </button>
    </div>
  );
};
export default slides;
