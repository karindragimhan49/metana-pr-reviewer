import { useEffect, useRef, useState } from 'react';

function WaveBackground() {
  const canvasRef = useRef(null);
  const [isDark, setIsDark] = useState(true);

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Wave configuration (increased speed)
const waves = [
  { amplitude: 50, frequency: 0.002,  speed: 0.04,  offset: 0,   opacity: 0.15 },
  { amplitude: 40, frequency: 0.003,  speed: 0.05,  offset: 100, opacity: 0.12 },
  { amplitude: 60, frequency: 0.0015, speed: 0.03,  offset: 200, opacity: 0.1  },
  { amplitude: 35, frequency: 0.0025, speed: 0.06,  offset: 300, opacity: 0.08 },
  { amplitude: 45, frequency: 0.0018, speed: 0.036, offset: 400, opacity: 0.13 },
];

    const drawWave = (wave, phase) => {
      ctx.beginPath();
      
      // Dynamic colors based on them
      const waveColor = isDark 
        ? `rgba(208, 252, 3, ${wave.opacity})`  // Neon green for dark mode
        : `rgba(10, 255, 10, ${wave.opacity })`; // Softer green for light mode
      
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 2;

      for (let x = 0; x < canvas.width; x++) {
        const y = 
          canvas.height / 3 + 
          wave.amplitude * Math.sin(x * wave.frequency + phase + wave.offset);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    };

    const animate = () => {
      // Dynamic background based on theme
      ctx.fillStyle = isDark ? '#0a0a0a' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update time
      time += 0.01;

      // Draw all waves
      waves.forEach(wave => {
        drawWave(wave, time * wave.speed);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]); // Re-run when theme changes

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

export default WaveBackground;
