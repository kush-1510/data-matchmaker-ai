import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center">
      <p className="text-muted-foreground flex justify-center items-end">
        Made with ❤️ by {' '}
        <a 
          href="https://atlan.com/?ref=/regovern-quiz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          <img src="https://website-assets.atlan.com/img/atlan-blue.svg" className="ml-2 mb-1" alt="Atlan logo" width={70} height={100} />
        </a>
      </p>
    </footer>
  );
};