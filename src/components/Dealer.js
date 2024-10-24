// src/components/Dealer.js
import React from 'react';
import { User } from 'lucide-react';

function Dealer({ isActive, message }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: isActive ? '0' : '-100%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '10%',
      minWidth: '100px',
      transition: 'bottom 0.5s ease-in-out',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'linear-gradient(to bottom, #2c3e50, #1a1a1a)',
        padding: '20px',
        borderRadius: '50% 50% 0 0',
        boxShadow: '0 -5px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: '#34495e',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #fff'
        }}>
          <User size={40} color="white" />
        </div>
        <div style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '0.9em',
          padding: '10px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '10px',
          maxWidth: '200px'
        }}>
          {message}
        </div>
      </div>
    </div>
  );
}

export default Dealer;