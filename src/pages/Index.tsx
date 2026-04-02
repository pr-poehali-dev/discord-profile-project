import { useRef, useEffect, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

function useSound() {
  const playClick = useCallback(() => {
    try {
      const AudioCtx = (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? window.AudioContext;
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (_e) { /* ignore */ }
  }, []);

  const playHover = useCallback(() => {
    try {
      const AudioCtx = (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? window.AudioContext;
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(660, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.06);
    } catch (_e) { /* ignore */ }
  }, []);

  return { playClick, playHover };
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#07060f]" />
      <div
        className="absolute animate-orb-move-1"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)",
          top: "10%",
          left: "15%",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute animate-orb-move-2"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)",
          bottom: "10%",
          right: "15%",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute animate-orb-move-3"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(139,92,246,0.08) 60%, transparent 70%)",
          top: "50%",
          left: "55%",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: "transform 0.15s ease-out", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

const DISCORD_AVATAR =
  "https://api.dicebear.com/9.x/adventurer/svg?seed=cosmic&backgroundColor=1a1a2e";

export default function Index() {
  const { playClick, playHover } = useSound();
  const [mounted, setMounted] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 100);
    const t2 = setTimeout(() => setStatusVisible(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const socialLinks = [
    {
      label: "Spotify",
      icon: "Music",
      href: "https://open.spotify.com",
      gradFrom: "#1db954",
      gradTo: "#158a3e",
      glow: "rgba(29,185,84,0.35)",
      textColor: "#ffffff",
    },
    {
      label: "Steam",
      icon: "Gamepad2",
      href: "https://store.steampowered.com",
      gradFrom: "#1b2838",
      gradTo: "#2a475e",
      glow: "rgba(42,71,94,0.7)",
      textColor: "#c7d5e0",
    },
  ];

  return (
    <>
      <AnimatedBackground />

      <main className="min-h-screen flex items-center justify-center p-4 font-golos">
        <div
          className="w-full max-w-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        >
          <TiltCard
            className="rounded-3xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 40px rgba(139,92,246,0.2), 0 40px 80px rgba(0,0,0,0.6)" } as React.CSSProperties}
          >
            {/* Шапка — фон */}
            <div
              className="h-32 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #1a0533 0%, #0f1a4a 40%, #0a2a3a 70%, #1a0533 100%)",
                backgroundSize: "400% 400%",
              }}
            >
              <div
                className="absolute inset-0 animate-gradient-shift"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 60%, rgba(139,92,246,0.5) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.35) 0%, transparent 50%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)",
                }}
              />
              {/* Искры */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    background: "white",
                    left: `${10 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    opacity: 0.3 + (i % 3) * 0.2,
                    animation: `status-pulse ${2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            {/* Аватар */}
            <div className="relative px-5">
              <div className="absolute -top-10 left-5">
                <div
                  className="w-20 h-20 rounded-full border-[3px] overflow-hidden"
                  style={{
                    borderColor: "#07060f",
                    boxShadow:
                      "0 0 0 2px rgba(139,92,246,0.7), 0 0 20px rgba(139,92,246,0.4), 0 8px 24px rgba(0,0,0,0.5)",
                  }}
                >
                  <img
                    src={DISCORD_AVATAR}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    style={{ background: "#1a1a2e" }}
                  />
                </div>
                <div
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 animate-status-pulse"
                  style={{
                    backgroundColor: "#23a55a",
                    borderColor: "#07060f",
                    boxShadow: "0 0 8px rgba(35,165,90,0.9)",
                  }}
                />
              </div>
            </div>

            {/* Контент */}
            <div className="pt-12 px-5 pb-6">
              {/* Ник */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(12px)",
                  transition: "all 0.6s ease 0.3s",
                }}
              >
                <h1
                  className="font-bebas tracking-widest leading-none"
                  style={{
                    fontSize: "2.4rem",
                    letterSpacing: "0.18em",
                    background: "linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  |ET| Fialka
                </h1>
                <p className="text-white/35 text-xs font-golos mt-0.5 tracking-widest">
                  eternalkills · #0001
                </p>
              </div>

              {/* Статус активности */}
              <div
                className="mt-3 flex items-center gap-2"
                style={{
                  opacity: statusVisible ? 1 : 0,
                  transform: statusVisible ? "translateY(0)" : "translateY(8px)",
                  transition: "all 0.5s ease",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-status-pulse"
                  style={{ backgroundColor: "#a78bfa" }}
                />
                <span className="text-white/50 text-xs font-golos tracking-wide">
                  🎮 Играю в что-то интересное
                </span>
              </div>

              {/* Делитель */}
              <div
                className="my-4"
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, rgba(139,92,246,0.5), rgba(59,130,246,0.25), transparent)",
                }}
              />

              {/* Биография */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: "opacity 0.6s ease 0.5s",
                }}
              >
                <p
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2.5"
                  style={{ color: "rgba(167,139,250,0.85)" }}
                >
                  Обо мне
                </p>
                <p className="text-white/60 text-sm leading-relaxed font-golos">
                  𝙻𝚎𝚊𝚍𝚎𝚛 𝚘𝚏 𝙴𝚃
                  <br /><br />
                  𝚆𝚛𝚒𝚝𝚎 𝚝𝚑𝚛𝚘𝚞𝚐𝚑 𝚖𝚢 𝚖𝚊𝚗𝚊𝚐𝚎𝚛!
                  <br />
                  <span className="text-white/40">Manager:</span>{" "}
                  <span style={{ color: "#a78bfa" }}>manager_elitetwo</span>
                </p>
              </div>

              {/* Делитель */}
              <div
                className="my-4"
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, rgba(59,130,246,0.25), rgba(139,92,246,0.5), transparent)",
                }}
              />

              {/* Кнопки */}
              <div
                className="flex flex-col gap-2.5"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(15px)",
                  transition: "all 0.7s ease 0.7s",
                }}
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${link.gradFrom}, ${link.gradTo})`,
                      boxShadow: `0 4px 20px ${link.glow}`,
                      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.01)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${link.glow}`;
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${link.glow}`;
                    }}
                  >
                    {/* Shine */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
                        transition: "opacity 0.3s ease",
                      }}
                    />
                    <Icon name={link.icon as Parameters<typeof Icon>[0]["name"]} size={18} style={{ color: link.textColor }} />
                    <span
                      className="font-golos font-semibold text-sm"
                      style={{ color: link.textColor }}
                    >
                      {link.label}
                    </span>
                    <Icon
                      name="ExternalLink"
                      size={13}
                      className="ml-auto opacity-40 group-hover:opacity-90"
                      style={{ color: link.textColor, transition: "opacity 0.2s" }}
                    />
                  </a>
                ))}
              </div>

              {/* Подпись */}
              <div className="mt-5 flex items-center justify-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-status-pulse"
                  style={{ background: "var(--p-violet)" }}
                />
                <span className="text-white/20 text-[10px] tracking-[0.25em] uppercase font-golos">
                  Discord Profile
                </span>
              </div>
            </div>
          </TiltCard>
        </div>
      </main>
    </>
  );
}