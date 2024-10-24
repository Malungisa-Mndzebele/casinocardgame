// src/components/DealingAnimation.js
import React, { useState, useEffect } from 'react';

function DealingAnimation({ onComplete }) {
  const [dealingPhase, setDealingPhase] = useState(0);
  
  useEffect(() => {
    const phases = [
      { delay: 0, duration: 1000 }, // Initial pause
      { delay: 1000, duration: 2000 }, // Deal player 1 cards
      { delay: 3000, duration: 2000 }, // Deal player 2 cards
      { delay: 5000, duration: 1000 }, // Final pause
    ];

    const timers = [];

    phases.forEach((phase, index) => {
      const timer = setTimeout(() => {
        setDealingPhase(index + 1);
        if (index === phases.length - 1) {
          setTimeout(onComplete, phase.duration);
        }
      }, phase.delay);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}>
        {Array(12).fill(null).map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: '60px',
              height: '90px',
              backgroundColor: '#fff',
              borderRadius: '5px',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) ${getDealingTransform(dealingPhase, index)}`,
              transition: 'all 0.5s ease',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: index,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getDealingTransform(phase, index) {
  switch(phase) {
    case 1: // Cards stacked
      return `translate(-50%, -50%)`;
    case 2: // Deal to player 1
      return index < 12 
        ? `translate(${-200 + (index * 30)}%, -150%) rotate(${index * 5}deg)`
        : 'translate(-50%, -50%)';
    case 3: // Deal to player 2
      return index < 12
        ? `translate(${-200 + (index * 30)}%, 50%) rotate(${index * 5}deg)`
        : `translate(${-200 + ((index - 12) * 30)}%, -150%) rotate(${index * 5}deg)`;
    default:
      return 'translate(-50%, -50%)';
  }
}

export default DealingAnimation;