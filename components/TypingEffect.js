import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypingEffect = ({ text, speed, fontSize }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset displayed text when the text prop changes
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [text, speed]);

  return <Text style={{fontSize: fontSize}}>{displayedText}</Text>;
};

export default TypingEffect;
