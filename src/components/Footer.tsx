import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center">
      <p className="text-muted-foreground">
        Want to see this match in action?{' '}
        <a 
          href="https://atlan.com/regovern/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Join us at Re:Govern →
        </a>
      </p>
    </footer>
  );
};