'use client';

import { useEffect, useRef } from 'react';
import { colors } from '@/styles/design-tokens';

interface AnimatedBackgroundProps {
  density?: 'low' | 'medium' | 'high';
}

export default function AnimatedBackground({ density = 'low' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = density === 'low' ? 30 : density === 'medium' ? 60 : 100;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? colors.accent.purple : colors.accent.cyan,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = colors.background.primary;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + '40';
        ctx.fill();

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 10
        );
        gradient.addColorStop(0, particle.color + '20');
        gradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(
          particle.x - particle.size * 10,
          particle.y - particle.size * 10,
          particle.size * 20,
          particle.size * 20
        );
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: colors.background.primary }}
    />
  );
}
