import { useState, useCallback } from "react";

const romanticMessages = [
  "I love you ❤️",
  "Always you",
  "Only you",
  "Forever 💫",
  "Just us",
  "You mean everything to me",
  "You make me smile",
  "My favorite person",
  "You feel like home",
  "I'm grateful for you",
  "Forever and always 💖",
  "My heart chose you",
  "With you, always",
  "You are my peace",
  "My heart is yours",
  "I'm here for you",
  "You're safe with me",
  "No matter what",
  "You're never alone",
  "I've got you",
  "You + Me ❤️",
  "Still choosing you",
  "Again and again",
  "Together",
  "Us 💞",
];

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  message: string;
}

const HeartIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const Index = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const randomMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    
    const newElement: FloatingElement = {
      id: idCounter,
      x: e.clientX,
      y: e.clientY,
      message: randomMessage,
    };

    setFloatingElements(prev => [...prev, newElement]);
    setIdCounter(prev => prev + 1);

    // Remove element after animation completes
    setTimeout(() => {
      setFloatingElements(prev => prev.filter(el => el.id !== newElement.id));
    }, 3500);
  }, [idCounter]);

  return (
    <div 
      className="romantic-bg min-h-screen w-full cursor-pointer select-none overflow-hidden relative"
      onClick={handleClick}
    >
      {/* Main centered message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <h1 
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground text-center leading-relaxed animate-gentle-fade-in"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          Rajdeep loves you so much
        </h1>
        
        {/* Subtle decorative hearts */}
        <div className="flex items-center gap-3 mt-8 animate-gentle-fade-in" style={{ animationDelay: '1.2s', opacity: 0 }}>
          <HeartIcon className="w-4 h-4 text-primary/40 animate-sparkle" style={{ animationDelay: '0s' } as React.CSSProperties} />
          <HeartIcon className="w-5 h-5 text-primary/60 animate-sparkle" style={{ animationDelay: '0.5s' } as React.CSSProperties} />
          <HeartIcon className="w-4 h-4 text-primary/40 animate-sparkle" style={{ animationDelay: '1s' } as React.CSSProperties} />
        </div>

        {/* Click hint */}
        <p 
          className="font-body text-lg sm:text-xl text-muted-foreground mt-12 animate-gentle-fade-in animate-hint italic"
          style={{ animationDelay: '2s', opacity: 0 }}
        >
          tap anywhere to send love
        </p>
      </div>

      {/* Floating hearts and messages */}
      {floatingElements.map((element) => (
        <div key={element.id}>
          {/* Heart */}
          <div
            className="fixed pointer-events-none z-10"
            style={{
              left: element.x - 16,
              top: element.y - 16,
            }}
          >
            <HeartIcon 
              className="w-8 h-8 text-primary heart-glow animate-float-heart"
            />
          </div>
          
          {/* Message */}
          <div
            className="fixed pointer-events-none z-20"
            style={{
              left: element.x,
              top: element.y - 40,
              transform: 'translateX(-50%)',
            }}
          >
            <span 
              className="font-display text-lg sm:text-xl text-foreground/90 whitespace-nowrap animate-float-message"
              style={{ 
                textShadow: '0 2px 10px hsl(var(--rose-glow) / 0.3)',
              }}
            >
              {element.message}
            </span>
          </div>
        </div>
      ))}

      {/* Ambient decorative elements */}
      <div className="fixed top-10 left-10 opacity-20 pointer-events-none">
        <HeartIcon className="w-6 h-6 text-primary animate-sparkle" style={{ animationDelay: '0.3s' } as React.CSSProperties} />
      </div>
      <div className="fixed top-20 right-16 opacity-15 pointer-events-none">
        <HeartIcon className="w-4 h-4 text-primary animate-sparkle" style={{ animationDelay: '1.2s' } as React.CSSProperties} />
      </div>
      <div className="fixed bottom-20 left-20 opacity-20 pointer-events-none">
        <HeartIcon className="w-5 h-5 text-primary animate-sparkle" style={{ animationDelay: '0.8s' } as React.CSSProperties} />
      </div>
      <div className="fixed bottom-16 right-24 opacity-15 pointer-events-none">
        <HeartIcon className="w-4 h-4 text-primary animate-sparkle" style={{ animationDelay: '1.5s' } as React.CSSProperties} />
      </div>
    </div>
  );
};

export default Index;
