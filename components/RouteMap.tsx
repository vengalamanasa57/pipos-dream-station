'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { sound } from './SoundEngine';
import confetti from 'canvas-confetti';

interface House {
  id: number;
  name: string;
  dream: string;
  cx: number;
  cy: number;
  delivered: boolean;
}

interface RouteMapProps {
  onComplete?: () => void;
}

export default function RouteMap({ onComplete }: RouteMapProps) {
  const [houses, setHouses] = useState<House[]>([
    { id: 1, name: "Bunny's Den", dream: "Fields of Golden Clover", cx: 50, cy: 95, delivered: true },
    { id: 2, name: "Owl's Hollow", dream: "Starlight Breeze", cx: 150, cy: 45, delivered: true },
    { id: 3, name: "Ghost's Attic", dream: "Toasty Warm Blankets", cx: 250, cy: 110, delivered: false },
    { id: 4, name: "Bear's Cave", dream: "Honeycomb Galaxies", cx: 345, cy: 60, delivered: false },
  ]);

  const [pipPos, setPipPos] = useState({ x: 150, y: 45 });
  const [isFlying, setIsFlying] = useState(false);

  const deliveredCount = houses.filter((h) => h.delivered).length;
  const isShiftComplete = deliveredCount === houses.length;

  const deliverDream = (house: House) => {
    if (house.delivered || isFlying) return;
    sound.playPop();
    setIsFlying(true);
    setPipPos({ x: house.cx, y: house.cy });

    setTimeout(() => {
      const updated = houses.map((h) => (h.id === house.id ? { ...h, delivered: true } : h));
      setHouses(updated);
      setIsFlying(false);
      sound.playChime(880);

      if (updated.every((h) => h.delivered)) {
        if (onComplete) onComplete();
        setTimeout(() => {
          sound.playFanfare();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        }, 300);
      } else {
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
      }
    }, 600);
  };

  const resetAll = () => {
    sound.playPop();
    setHouses((prev) => prev.map((h) => ({ ...h, delivered: false })));
    setPipPos({ x: 50, y: 95 });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif font-black text-base text-[#a34063]">Sector 7 Flight Deck</h3>
          <p className="text-xs opacity-75">Click cottages along the flight path to guide Pip&apos;s cloud delivery.</p>
        </div>
        <button
          onClick={resetAll}
          className="p-1 rounded bg-[#fde2e4] border border-[#5c4033] text-[#5c4033] hover:bg-[#ffd166] transition-colors"
          title="Reset Deliveries"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="relative w-full h-44 bg-[#1b1222] rounded-xl border-2 border-[#5c4033] overflow-hidden p-2 shadow-inner">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          <path
            d="M 50 95 Q 100 25 150 45 T 250 110 T 345 60"
            fill="none"
            stroke="#ffd166"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-75 animate-pulse"
          />

          {houses.map((h) => (
            <g key={h.id} className="cursor-pointer" onClick={() => deliverDream(h)}>
              <circle
                cx={h.cx}
                cy={h.cy}
                r="16"
                fill={h.delivered ? '#52b788' : '#a34063'}
                stroke="#ffd166"
                strokeWidth="2"
              />
              <text x={h.cx} y={h.cy + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                {h.delivered ? '✓' : '🏠'}
              </text>
            </g>
          ))}

          <g
            className="transition-all duration-700 ease-out pointer-events-none"
            style={{ transform: `translate(${pipPos.x - 12}px, ${pipPos.y - 28}px)` }}
          >
            <circle cx="12" cy="12" r="10" fill="#ffd166" opacity="0.4" className="animate-ping" />
            <text x="12" y="16" textAnchor="middle" fontSize="16">☁️</text>
          </g>
        </svg>

        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[11px] font-mono text-[#ffd166] bg-black/60 px-3 py-1 rounded border border-[#ffd166]/30">
          <span>{isFlying ? 'Pip is flying...' : isShiftComplete ? '✨ All Deliveries Finished!' : 'Cloud docked in Sector 7'}</span>
          <span>{deliveredCount} / {houses.length} Little Critters Asleep</span>
        </div>
      </div>

      {isShiftComplete ? (
        <div className="p-4 bg-[#d8e2dc] border-2 border-[#2d6a4f] rounded-xl text-center text-[#2d6a4f] font-mono space-y-1.5 shadow-[3px_3px_0px_#2d6a4f]">
          <div className="text-2xl animate-bounce">🌙 ✨ 💤</div>
          <h4 className="font-bold text-sm">Shift Complete: The Entire Neighborhood is Sleeping Peacefully</h4>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            All 4 Sector 7 chimneys received their dream clouds. Pip lets out a gentle baby yawn and curls up under the stars.
          </p>
          <button
            onClick={resetAll}
            className="text-[11px] underline font-bold hover:text-[#1b4332] cursor-pointer pt-1"
          >
            Dispatch another night flight
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2">
          {houses.map((h) => (
            <div
              key={h.id}
              className={`p-2.5 rounded-lg border-2 border-[#5c4033] flex items-center justify-between text-xs transition-all ${
                h.delivered ? 'bg-[#d8e2dc] text-[#2d6a4f]' : 'bg-[#fff8f1] text-[#5c4033]'
              }`}
            >
              <div>
                <p className="font-bold">{h.name}</p>
                <p className="text-[10px] opacity-75">&ldquo;{h.dream}&rdquo;</p>
              </div>
              {!h.delivered && (
                <button
                  onClick={() => deliverDream(h)}
                  className="px-2.5 py-1 bg-[#ffd166] text-[#5c4033] border border-[#5c4033] rounded font-bold shadow-[1px_1px_0px_#5c4033] active:translate-y-0.5"
                >
                  Send Cloud
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}