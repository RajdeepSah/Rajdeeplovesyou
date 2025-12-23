import { useState, useCallback, useEffect, useRef } from "react";
import HeartIcon from "../components/HeartIcon";
import romanticMessages from "../constants/romanticMessages";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  message: string;
}

interface FlowerPetal {
  id: number;
  type: string;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  sway: number;
  size: number;
  color: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const MAX_ELEMENTS = 15;
const MAX_PETALS = 25;
const EDGE_PADDING = 50;
const FLOAT_DURATION = 3500;
const RIPPLE_DURATION = 600;
const FLOWER_DURATION = 4000;
const MILESTONE_DURATION = 1600;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const Index = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [flowerShower, setFlowerShower] = useState<FlowerPetal[]>([]);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutIds = useRef<number[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    return () => {
      timeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.current = [];
    };
  }, []);

  const playSound = useCallback(() => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyCz/LZiTYIG2m98OScTgwOUKzn77dlGgU7k9n0y3krBSh+zPLaizsKGGS57OmkUQ=="
    );
    audio.volume = 0.15;
    void audio.play().catch(() => {});
  }, []);

  const playChime = useCallback(() => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRn4GAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgo9Dbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyCz/LZiTYIG2m98OScTgwOUKzn77dlGgU7k9n0y3krBSh+zPLaizsKGGS57OmkUQ=="
    );
    audio.volume = 0.2;
    void audio.play().catch(() => {});
  }, []);

  const triggerFlowerShower = useCallback(
    (count: number) => {
      if (flowerShower.length >= MAX_PETALS) {
        return;
      }

      const flowerTypes = ["🌸", "🌺", "🌼", "💐", "🏵️"];
      const flowerColors = [
        "hsl(350 70% 70%)",
        "hsl(340 65% 72%)",
        "hsl(30 50% 94%)",
        "hsl(0 0% 98%)",
        "hsl(280 35% 85%)",
      ];
      const petalsToSpawn = Math.min(
        MAX_PETALS,
        15 + Math.floor(Math.random() * 11)
      );
      const petals: FlowerPetal[] = Array.from(
        { length: petalsToSpawn },
        (_, index) => ({
          id: Date.now() + index + Math.random(),
          type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
          x: Math.random() * window.innerWidth,
          delay: Math.random() * 0.4,
          duration: 3 + Math.random(),
          rotation: Math.random() * 360,
          sway: 20 + Math.random() * 30,
          size: 20 + Math.random() * 20,
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
        })
      );

      setFlowerShower(petals);
      setMilestoneMessage(`${count} Flowers! 🌸`);
      playChime();

      const clearPetalsTimeout = window.setTimeout(() => {
        setFlowerShower([]);
      }, FLOWER_DURATION);
      timeoutIds.current.push(clearPetalsTimeout);

      const clearMessageTimeout = window.setTimeout(() => {
        setMilestoneMessage(null);
      }, MILESTONE_DURATION);
      timeoutIds.current.push(clearMessageTimeout);
    },
    [flowerShower.length, playChime]
  );

  const spawnAt = useCallback(
    (clientX: number, clientY: number) => {
      if (floatingElements.length >= MAX_ELEMENTS) {
        return;
      }

      const x = clamp(clientX, EDGE_PADDING, window.innerWidth - EDGE_PADDING);
      const y = clamp(clientY, EDGE_PADDING, window.innerHeight - EDGE_PADDING);
      const id = Date.now() + Math.random();
      const rippleId = Date.now() + Math.random();
      const randomMessage =
        romanticMessages[Math.floor(Math.random() * romanticMessages.length)];

      const newElement: FloatingElement = {
        id,
        x,
        y,
        message: randomMessage,
      };

      setFloatingElements((prev) => [...prev, newElement]);
      setRipples((prev) => [...prev, { id: rippleId, x, y }]);
      playSound();
      setTotalClicks((prev) => {
        const next = prev + 1;
        if (next % 10 === 0) {
          triggerFlowerShower(next);
        }
        return next;
      });

      const floatTimeoutId = window.setTimeout(() => {
        setFloatingElements((prev) => prev.filter((el) => el.id !== id));
      }, FLOAT_DURATION);
      timeoutIds.current.push(floatTimeoutId);

      const rippleTimeoutId = window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== rippleId));
      }, RIPPLE_DURATION);
      timeoutIds.current.push(rippleTimeoutId);
    },
    [floatingElements.length, playSound, triggerFlowerShower]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") {
        e.preventDefault();
      }
      spawnAt(e.clientX, e.clientY);
    },
    [spawnAt]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        spawnAt(window.innerWidth / 2, window.innerHeight / 2);
      }
    },
    [spawnAt]
  );

  return (
    <div 
      className="romantic-bg min-h-screen w-full cursor-pointer select-none overflow-hidden relative touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      onPointerDown={handlePointerDown}
      onTouchStart={(e) => e.preventDefault()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Click anywhere to send love messages"
    >
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <HeartIcon className="w-8 h-8 text-primary animate-gentle-pulse" />
            <span className="font-body text-base">loading love</span>
          </div>
        </div>
      )}
      {isLoaded && (
        <>
          {/* Main centered message */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <h1 
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground text-center leading-relaxed animate-gentle-fade-in"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              Rajdeep loves you so much
            </h1>
            
            {/* Subtle decorative hearts */}
            <div className="flex items-center gap-3 mt-8 animate-gentle-fade-in" style={{ animationDelay: "1.2s", opacity: 0 }}>
              <HeartIcon className="w-4 h-4 text-primary/40 animate-sparkle" style={{ animationDelay: "0s" }} />
              <HeartIcon className="w-5 h-5 text-primary/60 animate-sparkle" style={{ animationDelay: "0.5s" }} />
              <HeartIcon className="w-4 h-4 text-primary/40 animate-sparkle" style={{ animationDelay: "1s" }} />
            </div>

            {/* Click hint */}
            <p 
              className="font-body text-lg sm:text-xl text-muted-foreground mt-12 animate-gentle-fade-in animate-hint italic"
              style={{ animationDelay: "2s", opacity: 0 }}
            >
              tap anywhere to send love
            </p>
          </div>

          {/* Touch ripples */}
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className="fixed pointer-events-none z-[5]"
              style={{
                top: 0,
                left: 0,
                transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0)`,
              }}
            >
              <span className="ripple-ring" />
            </div>
          ))}

          {/* Flower shower */}
          {flowerShower.map((petal) => (
            <span
              key={petal.id}
              className="flower-petal"
              style={{
                left: petal.x,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
                color: petal.color,
                ["--petal-rotate" as string]: `${petal.rotation}deg`,
                ["--petal-sway" as string]: `${petal.sway}px`,
                ["--petal-size" as string]: `${petal.size}px`,
              }}
            >
              {petal.type}
            </span>
          ))}

          {/* Milestone message */}
          {milestoneMessage && (
            <div className="milestone-message">
              <span className="font-display text-2xl sm:text-3xl">
                {milestoneMessage}
              </span>
            </div>
          )}

          {/* Floating hearts and messages */}
          {floatingElements.map((element) => (
            <div key={element.id}>
              {/* Heart */}
              <div
                className="fixed pointer-events-none z-10"
                style={{
                  top: 0,
                  left: 0,
                  transform: `translate3d(${element.x - 16}px, ${element.y - 16}px, 0)`,
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
                  top: 0,
                  left: 0,
                  transform: `translate3d(${element.x}px, ${element.y - 40}px, 0)`,
                }}
              >
                <div className="max-w-[70vw] -translate-x-1/2 text-center">
                  <span 
                    className="font-display text-lg sm:text-xl text-foreground/90 animate-float-message"
                    style={{ 
                      textShadow: "0 2px 10px hsl(var(--rose-glow) / 0.3)",
                    }}
                  >
                    {element.message}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Ambient decorative elements */}
          <div className="fixed top-10 left-10 opacity-20 pointer-events-none">
            <HeartIcon className="w-6 h-6 text-primary animate-sparkle" style={{ animationDelay: "0.3s" }} />
          </div>
          <div className="fixed top-20 right-16 opacity-15 pointer-events-none">
            <HeartIcon className="w-4 h-4 text-primary animate-sparkle" style={{ animationDelay: "1.2s" }} />
          </div>
          <div className="fixed bottom-20 left-20 opacity-20 pointer-events-none">
            <HeartIcon className="w-5 h-5 text-primary animate-sparkle" style={{ animationDelay: "0.8s" }} />
          </div>
          <div className="fixed bottom-16 right-24 opacity-15 pointer-events-none">
            <HeartIcon className="w-4 h-4 text-primary animate-sparkle" style={{ animationDelay: "1.5s" }} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
