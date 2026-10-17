'use client';

import React from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { sound } from './SoundEngine';

interface DreamDeliveryModalProps {
  visitorName: string;
  onClose: () => void;
}

export default function DreamDeliveryModal({ visitorName, onClose }: DreamDeliveryModalProps) {
  const recipient = visitorName || 'Curious Dreamer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#fff8f1] border-2 border-[#5c4033] rounded-2xl p-6 shadow-[6px_6px_0px_#5c4033] text-[#5c4033]">
        <button
          onClick={() => { sound.playPop(); onClose(); }}
          className="absolute top-3 right-3 p-1 rounded-md bg-[#fde2e4] border-2 border-[#5c4033] text-[#5c4033] hover:bg-[#a34063] hover:text-white transition-colors"
          aria-label="Close delivery"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-2 mb-3 border-b-2 border-[#5c4033] pb-2">
          <div className="p-2 bg-[#ffd166] border-2 border-[#5c4033] rounded-lg">
            <Mail size={18} className="text-[#5c4033]" />
          </div>
          <div>
            <h3 className="font-serif font-black text-base text-[#a34063]">Incoming Dream Delivery!</h3>
            <p className="text-[10px] font-mono opacity-70">Dispatched via Midnight Nursery Cloud Mail</p>
          </div>
        </div>

        <div className="bg-[#fffcf7] border-2 border-dashed border-[#a34063] rounded-xl p-4 text-xs font-mono space-y-2.5">
          <p className="font-bold text-[#a34063]">To: {recipient} 🌙</p>
          <p className="leading-relaxed opacity-90">
            Pip noticed you visiting Midnight Nursery. Here is your official custom bedtime formula:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[#5c4033]">
            <li>1x Warm cinnamon marshmallow cloud</li>
            <li>3x Flawless, zero-warning hackathon demos</li>
            <li>Unlimited peaceful dreams accompanied by soft rain</li>
          </ul>
          <p className="pt-2 text-right text-[11px] font-bold text-[#a34063]">
            — Signed with cozy hugs, Pip 💀🍼
          </p>
        </div>

        <button
          onClick={() => { sound.playFanfare(); onClose(); }}
          className="mt-4 w-full py-2 bg-[#a34063] text-white border-2 border-[#5c4033] rounded-xl font-bold text-xs shadow-[3px_3px_0px_#5c4033] hover:bg-[#8e3554] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles size={14} /> Accept Tonight&apos;s Dream
        </button>
      </div>
    </div>
  );
}