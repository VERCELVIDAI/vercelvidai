import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { UserCheck, Sparkles, ArrowRight, ShieldCheck, Video, CheckCircle2 } from 'lucide-react';

export default function AIAvatarGeneratorPage() {
  const avatars = [
    { name: 'Sarah M.', role: 'Corporate Presenter', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
    { name: 'David K.', role: 'Tech Explainer Host', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
    { name: 'Elena R.', role: 'UGC Content Creator', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
    { name: 'Alex T.', role: 'Product Specialist', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#100A12] text-[#F5EAF4]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05BCE]/15 border border-[#F05BCE]/30 text-xs font-bold text-[#F05BCE] mb-4 shadow-xs font-mono">
            <UserCheck className="w-3.5 h-3.5 text-[#F05BCE]" />
            <span>AI Talking Heads & Presenters</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#F5EAF4] tracking-tight">
            AI Avatar Presenters
          </h1>
          <p className="mt-4 text-base sm:text-xl text-[#A99AAA]">
            Create professional presenter videos and UGC testimonials without actors, cameras, or studios.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/create"
              className="px-7 py-3.5 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-[#F05BCE]/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Build an Avatar Video</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Avatar Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-16">
          {avatars.map((av, idx) => (
            <div key={idx} className="rounded-2xl bg-[#211522] border border-[#39233B] overflow-hidden group shadow-md hover:border-[#F05BCE]/40 transition-all">
              <div className="aspect-[4/5] relative overflow-hidden bg-black">
                <img
                  src={av.img}
                  alt={av.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-[#F5EAF4] font-bold text-base">{av.name}</h4>
                  <p className="text-xs text-[#F05BCE] font-semibold">{av.role}</p>
                </div>
              </div>
              <div className="p-3 border-t border-[#39233B] bg-[#100A12] flex justify-between items-center text-xs">
                <span className="text-[#A99AAA] font-medium font-mono">Lip-sync: 99.4%</span>
                <Link href={`/create?avatar=${encodeURIComponent(av.name)}`} className="text-[#F05BCE] font-bold hover:underline">
                  Use Avatar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
