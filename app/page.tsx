'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Moon, Sun, Send, 
  Sparkle, X, Music, Radio, Star, Sparkles,
  BookOpen, Smile, Bed, Compass, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../components/SoundEngine';
import DreamDeliveryModal from '../components/DreamDeliveryModal';
import RouteMap from '../components/RouteMap';

interface StickyNote {
  id: number;
  author: string;
  wish: string;
  sticker: string;
  color: string;
  rotation: string;
  time: string;
}

type Mood = 'Curious' | 'Nervous' | 'Sleepy' | 'Creative';

export default function PipOSChampion() {
  useEffect(() => {
    console.log(
      `%c 💀 Pip the Skull Baby %c Junior Dream Engineer at Midnight Nursery \n%c👀 Psst... Pip sees you inspecting dreams! Please don't debug the bedtime magic ✨`,
      'background: #a34063; color: #fff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'background: #ffd166; color: #5c4033; font-size: 12px; font-weight: bold; padding: 4px;',
      'color: #a34063; font-size: 12px; font-style: italic; margin-top: 6px;'
    );
  }, []);

  const [booted, setBooted] = useState(false);
  const [bootProgress, setBootProgress] = useState(25);

  useEffect(() => {
    const timer = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setBooted(true), 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const [visitorName, setVisitorName] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pip_visitor_name');
    if (saved) setVisitorName(saved);

    const deliveryTimer = setTimeout(() => {
      setShowDeliveryModal(true);
      sound.playChime(659.25);
    }, 18000);

    return () => clearTimeout(deliveryTimer);
  }, []);

  const [isSleeping, setIsSleeping] = useState(false);
  const sleepTimer = useRef<NodeJS.Timeout | null>(null);

  const resetSleep = () => {
    if (isSleeping) {
      setIsSleeping(false);
      sound.playChime(659.25);
    }
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => setIsSleeping(true), 14000);
  };

  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; char: string }[]>([]);

  useEffect(() => {
    let count = 0;
    const handleMove = (e: MouseEvent) => {
      resetSleep();
      const centerX = window.innerWidth / 2;
      const centerY = 190;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const dist = Math.min(5, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 35);
      setPupilPos({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });

      count++;
      if (count % 4 === 0) {
        const chars = ['✦', '★', '⋆', '･', '🫧'];
        setSparkles((prev) => [
          ...prev.slice(-12),
          { id: Math.random(), x: e.clientX, y: e.clientY, char: chars[Math.floor(Math.random() * chars.length)] }
        ]);
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
    };
  }, [isSleeping]);

  useEffect(() => {
    const timer = setInterval(() => setSparkles((prev) => prev.slice(1)), 70);
    return () => clearInterval(timer);
  }, []);

  const [isNight, setIsNight] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'm') toggleMute();
      if (e.key.toLowerCase() === 'n') setIsNight((p) => !p);
      if (e.key.toLowerCase() === 'c') setChaosMode((p) => !p);
      if (e.key.toLowerCase() === 's') bringToFront('scanner');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isMuted]);

  const [odometer, setOdometer] = useState('001247');
  useEffect(() => {
    const current = Number(localStorage.getItem('pip_odometer') || 1247) + 1;
    localStorage.setItem('pip_odometer', current.toString());
    setOdometer(current.toString().padStart(6, '0'));
  }, []);

  const [topZ, setTopZ] = useState(10);
  const [windows, setWindows] = useState<{ [key: string]: { isOpen: boolean; zIndex: number } }>({
    profile: { isOpen: true, zIndex: 10 },
    lullaby: { isOpen: true, zIndex: 9 },
    route: { isOpen: false, zIndex: 8 },
    scanner: { isOpen: false, zIndex: 7 },
  });

  const bringToFront = (key: string) => {
    sound.playPop();
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((prev) => ({
      ...prev,
      [key]: { isOpen: true, zIndex: nextZ }
    }));

    // Smoothly scroll the window into view
    setTimeout(() => {
      const el = document.getElementById(`window-${key}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const closeWindow = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    setWindows((prev) => ({
      ...prev,
      [key]: { ...prev[key], isOpen: false }
    }));
  };

  const [selectedMood, setSelectedMood] = useState<Mood>('Creative');
  const [scanning, setScanning] = useState(false);
  const recipient = visitorName || 'Curious Dreamer';

  const moodDreams: Record<Mood, string[]> = {
    Curious: [
      `${recipient}, tonight you discover an observatory on a hollow moon where fireflies whisper secret algorithms.`,
      `${recipient}, you sail an origami boat into a starlit library where kittens teach celestial astronomy.`
    ],
    Nervous: [
      `${recipient}, your upcoming presentation is attended only by supportive, gently clapping teddy bears.`,
      `${recipient}, you sink into a warm strawberry-milk cloud where all deadline worries instantly melt away.`
    ],
    Sleepy: [
      `${recipient}, you are tucked beneath a cinnamon-scented quilt while soft rain plays music-box chimes on your window.`,
      `${recipient}, a hammock stretched between two friendly stars rocks you into deep, dreamless rest.`
    ],
    Creative: [
      `${recipient}, you walk through a city where glowing paintbrushes write flawless React code with zero bugs.`,
      `${recipient}, flying whales drop warm blueberry pancakes onto your starlight kitchen table.`
    ]
  };

  const [scannedDream, setScannedDream] = useState(moodDreams.Creative[0]);

  const handleScan = (mood: Mood) => {
    setSelectedMood(mood);
    setScanning(true);
    sound.playPop();
    sound.playScannerPulse();
    setTimeout(() => {
      const options = moodDreams[mood];
      setScannedDream(options[Math.floor(Math.random() * options.length)]);
      setScanning(false);
      sound.playChime(880);
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    }, 1200);
  };

  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [author, setAuthor] = useState('');
  const [wish, setWish] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('pip_sticky_notes');
    if (saved) {
      try { setNotes(JSON.parse(saved)); } catch (e) {}
    } else {
      setNotes([
        { id: 1, author: "Mochi Bunny", wish: "Pip's lullabies saved my bedtime!", sticker: "🍓", color: "bg-[#fff3b0]", rotation: "-rotate-2", time: "10m ago" },
        { id: 2, author: "Little Ghost", wish: "Warm blankets arrived right on time.", sticker: "👻", color: "bg-[#e8dff5]", rotation: "rotate-3", time: "1h ago" },
      ]);
    }
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !wish) return;
    sound.playPop();
    const colors = ['bg-[#fff3b0]', 'bg-[#e8dff5]', 'bg-[#fce1e4]', 'bg-[#ddedea]'];
    const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2'];
    const stickers = ['⭐', '🍼', '🌙', '🧸', '🍓'];
    const newNote: StickyNote = {
      id: Date.now(),
      author,
      wish,
      sticker: stickers[Math.floor(Math.random() * stickers.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: rotations[Math.floor(Math.random() * rotations.length)],
      time: 'Just now'
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('pip_sticky_notes', JSON.stringify(updated));
    localStorage.setItem('pip_visitor_name', author);
    setVisitorName(author);
    setAuthor('');
    setWish('');
  };

  const [bowClicks, setBowClicks] = useState(0);
  const [vaultOpen, setVaultOpen] = useState(false);

  const handleBowClick = () => {
    const next = bowClicks + 1;
    setBowClicks(next);
    sound.playPop();
    if (next >= 5 && !vaultOpen) {
      setVaultOpen(true);
      sound.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  };

  if (!booted) {
    return (
      <div className="fixed inset-0 bg-[#2b1828] text-[#ffd166] font-mono flex flex-col items-center justify-center p-6 select-none z-50">
        <p className="text-xl sm:text-2xl font-bold mb-2">Midnight Nursery BIOS v4.04</p>
        <p className="text-sm opacity-80 mb-6">Booting PipOS 98 · Loading Cloud Coordinates...</p>
        <div className="w-64 h-5 border-2 border-[#ffd166] p-0.5 rounded-sm">
          <div className="h-full bg-[#a34063] transition-all duration-150" style={{ width: `${bootProgress}%` }} />
        </div>
        <p className="text-xs mt-3 opacity-70">{bootProgress}% ready · Good things start small.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative font-sans select-none overflow-x-hidden transition-colors duration-700 ${
      isNight ? 'bg-[#1b1222] text-[#fce1e4]' : 'bg-[#fff8f1] text-[#5c4033]'
    }`}>
      
      {/* Sparkles Cursor */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden sm:block">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute text-[#a34063] font-bold"
            style={{ left: `${s.x}px`, top: `${s.y}px`, transform: 'translate(-50%, -50%)' }}
          >
            {s.char}
          </span>
        ))}
      </div>

      {/* Chaos Mode */}
      {chaosMode && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          <div className="absolute top-12 left-16 text-5xl animate-bounce">🍼</div>
          <div className="absolute top-1/2 right-12 text-6xl animate-spin duration-1000">★</div>
          <div className="absolute bottom-24 left-1/4 text-5xl animate-pulse">🧸</div>
          <div className="absolute top-1/4 left-2/3 text-6xl animate-bounce">💤</div>
        </div>
      )}

      {/* Modal */}
      {showDeliveryModal && (
        <DreamDeliveryModal 
          visitorName={visitorName} 
          onClose={() => setShowDeliveryModal(false)} 
        />
      )}

      {/* Marquee Banner */}
      <div className="bg-[#a34063] text-white text-[11px] font-mono py-1 px-4 border-b-2 border-[#5c4033] flex justify-between items-center overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block font-bold">
          ★ PIPOS 98 · JUNIOR DREAM ENGINEER · MIDNIGHT NURSERY ★ [SHORTCUTS: M=Mute, N=Night, C=Chaos, S=Scanner] ★
        </div>
        <div className="hidden sm:flex items-center gap-2 pl-4 text-xs">
          <span>⚡ 100% Cozy · Never Gory ⚡</span>
        </div>
      </div>

      {/* Top Taskbar */}
      <header className={`border-b-2 border-[#5c4033] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-[0_2px_0px_#5c4033] ${
        isNight ? 'bg-[#281a33]' : 'bg-[#fde2e4]'
      }`}>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => bringToFront('profile')}
            className="px-2.5 py-1 bg-[#a34063] text-white border-2 border-[#5c4033] rounded font-mono text-xs font-bold shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5 flex items-center gap-1.5"
          >
            <span>🧸</span> PipOS
          </button>
          {visitorName && (
            <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 bg-[#fff8f1] border border-[#5c4033] rounded text-[#a34063]">
              Welcome back, {visitorName}!
            </span>
          )}
        </div>

        {/* Odometer */}
        <div className="flex items-center gap-2 bg-[#2d1b22] px-2.5 py-1 rounded border-2 border-[#5c4033]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#ffd166]">Dreams Delivered:</span>
          <div className="flex gap-0.5">
            {odometer.split('').map((d, i) => (
              <span key={i} className="w-4 h-5 bg-black text-[#ff758f] font-mono text-xs font-bold flex items-center justify-center rounded-sm">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sound.playPop(); setShowDeliveryModal(true); }}
            className="relative text-[11px] px-2.5 py-1 rounded bg-[#fff8f1] text-[#a34063] border-2 border-[#5c4033] shadow-[2px_2px_0px_#5c4033] font-bold active:translate-y-0.5 flex items-center gap-1.5"
            title="Open Your Personalized Delivery"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a34063] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a34063]"></span>
            </span>
            <span>📨 Letter For You</span>
          </button>
          <button
            onClick={() => { sound.playPop(); setChaosMode(!chaosMode); }}
            className="text-[11px] px-2 py-1 rounded bg-[#ffd166] text-[#5c4033] border-2 border-[#5c4033] shadow-[2px_2px_0px_#5c4033] font-bold active:translate-y-0.5"
          >
            {chaosMode ? '🧸 Chaos: ON' : '🧸 Chaos'}
          </button>
          <button
            onClick={() => { sound.playPop(); setIsNight(!isNight); }}
            className="p-1 rounded bg-[#fff8f1] border-2 border-[#5c4033] text-[#5c4033] shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5"
            aria-label="Toggle Night Mode"
          >
            {isNight ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={toggleMute}
            className="p-1 rounded bg-[#fff8f1] border-2 border-[#5c4033] text-[#5c4033] shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX size={14} className="text-[#a34063]" /> : <Volume2 size={14} />}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Shortcuts */}
        <div className="lg:col-span-2 flex lg:flex-col flex-wrap gap-4 justify-center lg:justify-start">
          {[
            { id: 'profile', label: 'Bedtime Archives', icon: '💀', desc: 'Canon & Origin' },
            { id: 'lullaby', label: 'Lullaby Studio', icon: '🎵', desc: 'Chime Synthesizer' },
            { id: 'route', label: 'Flight Dispatch', icon: '🗺️', desc: 'Sector 7 Deck' },
            { id: 'scanner', label: 'Slumber Radar', icon: '📡', desc: 'Mood Frequency' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => bringToFront(item.id)}
              className="group flex flex-col items-center p-2 rounded-lg hover:bg-[#a34063]/10 border border-transparent hover:border-[#a34063]/30 transition-all text-center w-28 active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fff8f1] border-2 border-[#5c4033] flex items-center justify-center text-2xl shadow-[3px_3px_0px_#5c4033] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                {item.icon}
              </div>
              <span className="text-[11px] font-mono font-bold mt-1 text-[#a34063] truncate w-full">
                {item.label}
              </span>
              <span className="text-[9px] opacity-65 font-mono">{item.desc}</span>
            </button>
          ))}
        </div>

        {/* Windows Area */}
        <div className="lg:col-span-10 space-y-6">

          {/* Hero Stage */}
          <div className={`relative border-2 border-[#5c4033] rounded-2xl p-6 text-center shadow-[6px_6px_0px_#5c4033] transition-all ${
            isNight ? 'bg-[#241630]' : 'bg-[#fffcf7]'
          }`}>
            <div className="absolute top-3 left-4 flex items-center gap-1.5 text-xs font-mono">
              <span className={`w-2.5 h-2.5 rounded-full border border-[#5c4033] ${isSleeping ? 'bg-[#ffd166] animate-ping' : 'bg-[#52b788]'}`} />
              <span className="opacity-80">{isSleeping ? 'Pip is snoozing (move cursor to wake)' : 'Pip is awake & tracking'}</span>
            </div>

            <button
              onClick={handleBowClick}
              title="Pip's Nightcap Bow (Click 5x!)"
              className="absolute top-3 right-4 p-2 hover:scale-125 transition-transform cursor-pointer"
            >
              <Sparkle size={20} className="text-[#ffd166] fill-[#ffd166] animate-pulse" />
            </button>

            <div className="relative w-44 h-44 mx-auto my-3 cursor-pointer" onClick={() => sound.playChime(783.99)}>
              {isSleeping && (
                <div className="absolute -top-3 right-4 text-xl font-bold font-mono text-[#ffd166] animate-bounce">
                  Zzz...
                </div>
              )}

              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <ellipse cx="50" cy="85" rx="36" ry="12" fill="#e8e8e8" opacity="0.85" />
                <ellipse cx="35" cy="83" rx="14" ry="10" fill="#f5f5f5" />
                <ellipse cx="65" cy="83" rx="14" ry="10" fill="#f5f5f5" />

                <circle cx="50" cy="50" r="30" fill="#fffcf7" stroke="#5c4033" strokeWidth="2.5" />
                <circle cx="39" cy="48" r="8" fill="#5c4033" />
                <circle cx="61" cy="48" r="8" fill="#5c4033" />

                {isSleeping ? (
                  <>
                    <path d="M 34 50 Q 39 46 44 50" stroke="#ffd166" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 56 50 Q 61 46 66 50" stroke="#ffd166" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx={39 + pupilPos.x} cy={48 + pupilPos.y} r="2.8" fill="#ffd166" />
                    <circle cx={61 + pupilPos.x} cy={48 + pupilPos.y} r="2.8" fill="#ffd166" />
                  </>
                )}

                <path d="M 43 62 Q 50 67 57 61" stroke="#5c4033" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 23 44 Q 50 12 77 44" fill="#a34063" stroke="#5c4033" strokeWidth="2" />
                <path d="M 68 24 Q 85 20 82 40" fill="#a34063" stroke="#5c4033" strokeWidth="2" />
                <circle cx="82" cy="40" r="5" fill="#fde2e4" stroke="#5c4033" strokeWidth="1.5" />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#a34063]">
              Pip, The Skull Baby
            </h1>
            <p className="text-xs uppercase font-mono font-bold tracking-widest text-[#5c4033] bg-[#ffd166] inline-block px-3 py-1 rounded-full border border-[#5c4033] mt-1 mb-2">
              Junior Dream Engineer · Midnight Nursery
            </p>
            <p className="text-xs sm:text-sm max-w-lg mx-auto opacity-90 leading-relaxed">
              &ldquo;I build the dreams you fall asleep inside.&rdquo; Gentle, clumsy, and easily delighted. Pip designs music-box lullabies, soothing nightlights, and cozy bedtime stories for sleepy little creatures across town.
            </p>

            {vaultOpen && (
              <div className="mt-4 p-3 bg-[#fde2e4] text-[#a34063] border-2 border-[#a34063] rounded-xl text-xs font-mono shadow-[3px_3px_0px_#a34063] animate-bounce">
                🎉 <strong>SECRET UNLOCKED: Pip&apos;s Midnight Vault!</strong>
                <p className="mt-1">You found Pip&apos;s star bow! +100 Cloud Tokens unlocked. Sleep well, dreamer!</p>
              </div>
            )}
          </div>

          {/* Window 1: Profile & Story */}
          {windows.profile.isOpen && (
        <div 
          id="window-profile"
          style={{ zIndex: windows.profile.zIndex }}
            onClick={() => bringToFront('profile')}
              className={`border-2 border-[#5c4033] rounded-xl overflow-hidden shadow-[5px_5px_0px_#5c4033] ${
                isNight ? 'bg-[#291c33]' : 'bg-[#fffcf7]'
              }`}
            >
              <div className="bg-[#a34063] px-3 py-1.5 flex items-center justify-between text-white border-b-2 border-[#5c4033]">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span>💀</span> Bedtime Archives · Character Canon & Origin Journey
                </div>
                <button onClick={(e) => closeWindow('profile', e)} className="p-0.5 bg-[#fde2e4] text-[#5c4033] rounded border border-[#5c4033]">
                  <X size={12} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div className="grid sm:grid-cols-3 gap-4 items-center">
                  <div className="flex justify-center">
                    <img 
                      src="https://hax.baby/baby/assets/pip_portrait.png" 
                      alt="Pip Official Portrait"
                      className="w-32 h-32 object-contain rounded-lg border-2 border-[#5c4033] bg-[#fff8f1] p-1 shadow-[2px_2px_0px_#5c4033]"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5 text-xs">
                    <p><strong>Species:</strong> Skull Baby (Bedtime Sprite)</p>
                    <p><strong>Personality:</strong> Sleepy, giggles at snoring, hates utter silence.</p>
                    <p><strong>Craft:</strong> Junior Dream Engineer in charge of Sector 7.</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-[#fde2e4] text-[#a34063] border border-[#a34063] rounded font-mono font-bold">100% Cozy</span>
                      <span className="px-2 py-0.5 bg-[#ffd166] text-[#5c4033] border border-[#5c4033] rounded font-mono font-bold">Never Gory</span>
                      <span className="px-2 py-0.5 bg-[#d8e2dc] text-[#2d6a4f] border border-[#2d6a4f] rounded font-mono font-bold">Official Canon</span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-[#5c4033] pt-4">
                  <h4 className="font-serif font-black text-sm text-[#a34063] mb-3">Origin Journey (Scenes from Midnight Nursery)</h4>
                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#fff8f1] border-2 border-[#5c4033] rounded-lg shadow-[2px_2px_0px_#5c4033] text-[#5c4033]">
                      <div className="flex items-center gap-1.5 font-bold text-[#a34063] font-mono">
                        <Smile size={14} /> Scene 1: Arrival
                      </div>
                      <p className="mt-1 leading-relaxed opacity-90">
                        Pip woke on a pillow-soft cloud beneath velvet skies, discovering that darkness was just waiting for soft lullabies.
                      </p>
                    </div>
                    <div className="p-3 bg-[#fff8f1] border-2 border-[#5c4033] rounded-lg shadow-[2px_2px_0px_#5c4033] text-[#5c4033]">
                      <div className="flex items-center gap-1.5 font-bold text-[#a34063] font-mono">
                        <Music size={14} /> Scene 2: The Box
                      </div>
                      <p className="mt-1 leading-relaxed opacity-90">
                        Carving a wooden music box with tiny winding keys, Pip turned evening wind rustles into pentatonic melodies.
                      </p>
                    </div>
                    <div className="p-3 bg-[#fff8f1] border-2 border-[#5c4033] rounded-lg shadow-[2px_2px_0px_#5c4033] text-[#5c4033]">
                      <div className="flex items-center gap-1.5 font-bold text-[#a34063] font-mono">
                        <Bed size={14} /> Scene 3: Sector 7
                      </div>
                      <p className="mt-1 leading-relaxed opacity-90">
                        Appointed Junior Dream Engineer, Pip now flies over rooftops to ensure every restless creature sleeps warmly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Window 2: Lullaby Lab */}
          {windows.lullaby.isOpen && (
          <div 
            id="window-lullaby"
            style={{ zIndex: windows.lullaby.zIndex }}
              onClick={() => bringToFront('lullaby')}
              className={`border-2 border-[#5c4033] rounded-xl overflow-hidden shadow-[5px_5px_0px_#5c4033] ${
                isNight ? 'bg-[#291c33]' : 'bg-[#fffcf7]'
              }`}
            >
              <div className="bg-[#5c4033] px-3 py-1.5 flex items-center justify-between text-white border-b-2 border-[#5c4033]">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span>🎵</span> Lullaby Studio · Interactive Chime Synthesizer
                </div>
                <button onClick={(e) => closeWindow('lullaby', e)} className="p-0.5 bg-[#fde2e4] text-[#5c4033] rounded border border-[#5c4033]">
                  <X size={12} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://hax.baby/baby/assets/pip_lullaby_box.png" 
                      alt="Music Box" 
                      className="w-14 h-14 object-contain"
                    />
                    <div>
                      <h3 className="font-serif font-black text-base text-[#a34063]">The Lullaby Laboratory</h3>
                      <p className="text-xs opacity-75">Click keys to synthesize harmonic chimes, or auto-play melodies.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => [523.25, 523.25, 783.99, 783.99, 880.00, 880.00, 783.99].forEach((f, i) => setTimeout(() => sound.playChime(f), i * 340))}
                    className="px-3 py-1.5 text-xs bg-[#ffd166] text-[#5c4033] border-2 border-[#5c4033] rounded font-bold shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5"
                  >
                    ▶ Auto-Play Twinkle
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {[
                    { note: 'Do', freq: 523.25, color: 'bg-[#ffcad4]' },
                    { note: 'Re', freq: 587.33, color: 'bg-[#ffe5d9]' },
                    { note: 'Mi', freq: 659.25, color: 'bg-[#fff1e6]' },
                    { note: 'Fa', freq: 698.46, color: 'bg-[#d8e2dc]' },
                    { note: 'Sol', freq: 783.99, color: 'bg-[#ece4db]' },
                    { note: 'La', freq: 880.00, color: 'bg-[#cddafd]' },
                  ].map((k) => (
                    <button
                      key={k.note}
                      onClick={() => sound.playChime(k.freq)}
                      className={`${k.color} h-24 sm:h-28 rounded-lg border-2 border-[#5c4033] flex flex-col justify-end p-2 text-[#5c4033] font-mono font-bold shadow-[3px_3px_0px_#5c4033] hover:-translate-y-1 active:translate-y-0.5 transition-all`}
                    >
                      <span className="text-xs">{k.note}</span>
                      <span className="text-[10px] opacity-60">{Math.round(k.freq)}Hz</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Window 3: Route Map */}
          {windows.route.isOpen && (
          <div 
              id="window-route"
              style={{ zIndex: windows.route.zIndex }}
                onClick={() => bringToFront('route')}
              className={`border-2 border-[#5c4033] rounded-xl overflow-hidden shadow-[5px_5px_0px_#5c4033] ${
                isNight ? 'bg-[#291c33]' : 'bg-[#fffcf7]'
              }`}
            >
              <div className="bg-[#5c4033] px-3 py-1.5 flex items-center justify-between text-white border-b-2 border-[#5c4033]">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span>🗺️</span> Flight Dispatch · Sector 7 Rooftop Operations
                </div>
                <button onClick={(e) => closeWindow('route', e)} className="p-0.5 bg-[#fde2e4] text-[#5c4033] rounded border border-[#5c4033]">
                  <X size={12} />
                </button>
              </div>
              <div className="p-5">
                <RouteMap />
              </div>
            </div>
          )}

          {/* Window 4: Mood-Based Dream Scanner */}
          {windows.scanner.isOpen && (
          <div 
            id="window-scanner"
            style={{ zIndex: windows.scanner.zIndex }}
            onClick={() => bringToFront('scanner')}
              className={`border-2 border-[#5c4033] rounded-xl overflow-hidden shadow-[5px_5px_0px_#5c4033] ${
                isNight ? 'bg-[#291c33]' : 'bg-[#fffcf7]'
              }`}
            >
              <div className="bg-[#a34063] px-3 py-1.5 flex items-center justify-between text-white border-b-2 border-[#5c4033]">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span>📡</span> Slumber Radar · Mood-Calibrated Dream Engine
                </div>
                <button onClick={(e) => closeWindow('scanner', e)} className="p-0.5 bg-[#fde2e4] text-[#5c4033] rounded border border-[#5c4033]">
                  <X size={12} />
                </button>
              </div>

              <div className="p-5 text-center space-y-4">
                <div>
                  <h3 className="font-serif font-black text-lg text-[#a34063]">How are you feeling tonight?</h3>
                  <p className="text-xs opacity-75 mt-0.5">Select your mood to calibrate Pip&apos;s custom bedtime frequency.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {(['Curious', 'Nervous', 'Sleepy', 'Creative'] as Mood[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => handleScan(m)}
                      className={`px-3 py-1.5 rounded-lg border-2 border-[#5c4033] text-xs font-bold shadow-[2px_2px_0px_#5c4033] active:translate-y-0.5 transition-all ${
                        selectedMood === m ? 'bg-[#5c4033] text-white' : 'bg-[#fff8f1] text-[#5c4033]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#5c4033] bg-[#1e1329] relative flex items-center justify-center overflow-hidden shadow-inner">
                  <div className="absolute inset-0 border border-[#52b788]/20 rounded-full scale-75" />
                  <div className="absolute inset-0 border border-[#52b788]/20 rounded-full scale-50" />
                  <div className={`w-full h-0.5 bg-[#ffd166] absolute ${scanning ? 'animate-spin duration-700' : ''}`} />
                  <span className="text-3xl select-none">{scanning ? '📡' : '✨'}</span>
                </div>

                <div className="p-3 bg-[#fff8f1] border-2 border-[#5c4033] rounded-lg text-xs font-mono text-[#5c4033] max-w-md mx-auto shadow-[3px_3px_0px_#5c4033]">
                  <p className="text-[10px] text-[#a34063] uppercase font-bold tracking-widest mb-1">
                    {scanning ? 'SCANNING NIGHT SKY...' : `DREAM FREQUENCY FOR [${selectedMood.toUpperCase()}]:`}
                  </p>
                  <p className="text-sm font-bold leading-snug">
                    {scanning ? 'Calibrating starlight oscillators...' : `"${scannedDream}"`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Notes Guestbook */}
          <div className={`border-2 border-[#5c4033] rounded-xl p-5 shadow-[5px_5px_0px_#5c4033] ${
            isNight ? 'bg-[#291c33]' : 'bg-[#fffcf7]'
          }`}>
            <div className="flex items-center justify-between mb-3 border-b-2 border-[#5c4033] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💌</span>
                <h3 className="font-serif font-black text-base text-[#a34063]">Midnight Guestbook Wall</h3>
              </div>
              <span className="text-[11px] font-mono opacity-75">Saved automatically to browser memory</span>
            </div>

            <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder="Your Name / Handle"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="px-3 py-1.5 text-xs rounded border-2 border-[#5c4033] bg-[#fff8f1] text-[#5c4033] focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Write a cozy bedtime dream wish..."
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded border-2 border-[#5c4033] bg-[#fff8f1] text-[#5c4033] focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-[#a34063] text-white border-2 border-[#5c4033] rounded shadow-[2px_2px_0px_#5c4033] font-bold active:translate-y-0.5 flex items-center justify-center gap-1"
              >
                <Send size={12} /> Post Note
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {notes.map((n) => (
                <div 
                  key={n.id}
                  className={`${n.color} ${n.rotation} p-3 rounded-md border-2 border-[#5c4033] text-[#5c4033] shadow-[3px_3px_0px_#5c4033] flex flex-col justify-between h-28 hover:rotate-0 transition-transform`}
                >
                  <div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold font-mono">{n.author}</span>
                      <span>{n.sticker}</span>
                    </div>
                    <p className="text-xs mt-1 leading-tight">&ldquo;{n.wish}&rdquo;</p>
                  </div>
                  <span className="text-[9px] opacity-60 font-mono">{n.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <footer className="border-t-2 border-[#5c4033] bg-[#fde2e4] px-4 py-2.5 mt-8 flex flex-wrap justify-between items-center text-[11px] font-mono text-[#5c4033]">
        <div className="flex items-center gap-2">
          <span className="font-bold">Midnight Nursery Systems</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline opacity-80">Engineering Peaceful Dreams Since 1998</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Pip · Junior Dream Engineer</span>
          <span>🌙</span>
        </div>
      </footer>
    </div>
  );
}