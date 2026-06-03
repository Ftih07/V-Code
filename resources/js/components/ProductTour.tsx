import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

type TourStep = {
    target: string; // CSS selector
    title: string;
    content: string;
    icon: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
};

type Rect = { top: number; left: number; width: number; height: number };

const PADDING = 12; // spotlight padding around element

// ─── Helper: get element rect ────────────────────────────────────────────────

function getRect(selector: string): Rect | null {
    // Cari SEMUA elemen yang memiliki class tersebut
    const elements = document.querySelectorAll(selector);

    for (let i = 0; i < elements.length; i++) {
        const r = elements[i].getBoundingClientRect();

        // Cek apakah elemennya benar-benar tampil di layar (tidak display: none)
        if (r.width > 0 && r.height > 0) {
            return {
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
            };
        }
    }

    return null; // Kembalikan null jika elemen tidak ada/tersembunyi semua
}
// ─── Tooltip Placement ───────────────────────────────────────────────────────

function calcTooltipPos(
    rect: Rect,
    placement: TourStep['placement'],
    tooltipW: number,
    tooltipH: number,
) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 16;

    // Kita tinggikan sedikit estimasi tinggi tooltip untuk mobile (lebih aman)
    const safeTooltipH = tooltipH;

    const positions = {
        bottom: {
            top: rect.top + rect.height + PADDING + gap,
            left: Math.min(
                Math.max(rect.left + rect.width / 2 - tooltipW / 2, 12),
                vw - tooltipW - 12,
            ),
            arrow: 'top' as const,
        },
        top: {
            top: rect.top - PADDING - gap - safeTooltipH,
            left: Math.min(
                Math.max(rect.left + rect.width / 2 - tooltipW / 2, 12),
                vw - tooltipW - 12,
            ),
            arrow: 'bottom' as const,
        },
        right: {
            top: Math.min(
                Math.max(rect.top + rect.height / 2 - safeTooltipH / 2, 12),
                vh - safeTooltipH - 12,
            ),
            left: rect.left + rect.width + PADDING + gap,
            arrow: 'left' as const,
        },
        left: {
            top: Math.min(
                Math.max(rect.top + rect.height / 2 - safeTooltipH / 2, 12),
                vh - safeTooltipH - 12,
            ),
            left: rect.left - PADDING - gap - tooltipW,
            arrow: 'right' as const,
        },
    };

    let chosen: {
        top: number;
        left: number;
        arrow?: 'top' | 'bottom' | 'left' | 'right';
    } = { ...positions.bottom };

    if (!placement || placement === 'auto') {
        const spaceBelow = vh - (rect.top + rect.height + PADDING);
        const spaceAbove = rect.top - PADDING;
        const spaceRight = vw - (rect.left + rect.width + PADDING);

        if (spaceBelow >= safeTooltipH + gap) {
            chosen = positions.bottom;
        } else if (spaceAbove >= safeTooltipH + gap) {
            chosen = positions.top;
        } else if (spaceRight >= tooltipW + gap) {
            chosen = positions.right;
        } else {
            chosen = positions.bottom;
        } // Fallback bawaan
    } else {
        chosen = positions[placement] ?? positions.bottom;
    }

    // ─── THE MAGIC FIX: VIEWPORT BOUNDARY ───
    // 1. Cegah tooltip menembus batas BAWAH layar (sisakan ruang aman 40px)
    const maxTop = vh - safeTooltipH - 40;

    if (chosen.top > maxTop) {
        chosen.top = maxTop;
        chosen.arrow = undefined; // Sembunyikan panah karena tooltip terpaksa menimpa target
    }

    // 2. Cegah tooltip menembus batas ATAS layar
    if (chosen.top < 12) {
        chosen.top = 12;
        chosen.arrow = undefined;
    }

    return chosen;
}

// ─── SVG Spotlight Overlay ───────────────────────────────────────────────────

function SpotlightOverlay({
    rect,
    onSkip,
}: {
    rect: Rect | null;
    onSkip: () => void;
}) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const r = 16;

    if (!rect) {
        return (
            <div
                onClick={onSkip}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    zIndex: 9998,
                }}
            />
        );
    }

    const x = rect.left - PADDING;
    const y = rect.top - PADDING;
    const w = rect.width + PADDING * 2;
    const h = rect.height + PADDING * 2;

    const clipPath = `
        M0,0 H${vw} V${vh} H0 Z
        M${x + r},${y}
        H${x + w - r} Q${x + w},${y} ${x + w},${y + r}
        V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h}
        H${x + r} Q${x},${y + h} ${x},${y + h - r}
        V${y + r} Q${x},${y} ${x + r},${y}
        Z
    `;

    return (
        <svg
            onClick={onSkip}
            style={{
                position: 'fixed',
                inset: 0,
                width: vw,
                height: vh,
                zIndex: 9998,
                cursor: 'default',
            }}
        >
            {/* Tambahkan fillRule dan clipRule di sini */}
            <path
                d={clipPath}
                fill="rgba(0,0,0,0.55)"
                fillRule="evenodd"
                clipRule="evenodd"
            />
            {/* Highlight border around spotlight */}
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={r}
                fill="none"
                stroke="rgba(37,99,235,0.6)"
                strokeWidth="2"
            />
        </svg>
    );
}

// ─── Arrow indicator ─────────────────────────────────────────────────────────

function Arrow({ dir }: { dir: 'top' | 'bottom' | 'left' | 'right' }) {
    const base: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
    };
    const size = 7;
    const color = '#fff';

    if (dir === 'top') {
        return (
            <span
                style={{
                    ...base,
                    top: -size,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: `${size}px solid transparent`,
                    borderRight: `${size}px solid transparent`,
                    borderBottom: `${size}px solid ${color}`,
                }}
            />
        );
    }

    if (dir === 'bottom') {
        return (
            <span
                style={{
                    ...base,
                    bottom: -size,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: `${size}px solid transparent`,
                    borderRight: `${size}px solid transparent`,
                    borderTop: `${size}px solid ${color}`,
                }}
            />
        );
    }

    if (dir === 'left') {
        return (
            <span
                style={{
                    ...base,
                    left: -size,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderTop: `${size}px solid transparent`,
                    borderBottom: `${size}px solid transparent`,
                    borderRight: `${size}px solid ${color}`,
                }}
            />
        );
    }

    return (
        <span
            style={{
                ...base,
                right: -size,
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: `${size}px solid transparent`,
                borderBottom: `${size}px solid transparent`,
                borderLeft: `${size}px solid ${color}`,
            }}
        />
    );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({
    step,
    stepIndex,
    totalSteps,
    rect,
    onNext,
    onBack,
    onSkip,
    animKey,
}: {
    step: TourStep;
    stepIndex: number;
    totalSteps: number;
    rect: Rect | null;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    animKey: number;
}) {
    const tooltipW = 300;
    const tooltipH = 180; // estimated
    const isFirst = stepIndex === 0;
    const isLast = stepIndex === totalSteps - 1;

    const pos = rect
        ? calcTooltipPos(rect, step.placement, tooltipW, tooltipH)
        : {
              top: window.innerHeight / 2 - tooltipH / 2,
              left: window.innerWidth / 2 - tooltipW / 2,
              arrow: undefined,
          };

    return (
        <div
            key={animKey}
            style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                width: tooltipW,
                zIndex: 9999,
                background: '#fff',
                borderRadius: 16,
                boxShadow:
                    '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(37,99,235,0.12)',
                overflow: 'hidden',
                animation: 'tour-pop 0.22s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
        >
            {/* Arrow */}
            {pos.arrow && <Arrow dir={pos.arrow} />}

            {/* Header */}
            <div
                style={{
                    background:
                        'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                    padding: '14px 16px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                }}
            >
                <div
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#fff',
                    }}
                >
                    {step.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#fff',
                            lineHeight: 1.3,
                        }}
                    >
                        {step.title}
                    </p>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 11,
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: 1,
                        }}
                    >
                        {stepIndex + 1} / {totalSteps}
                    </p>
                </div>
                <button
                    onClick={onSkip}
                    style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: 'none',
                        borderRadius: 6,
                        width: 26,
                        height: 26,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        flexShrink: 0,
                    }}
                    title="Lewati tour"
                >
                    <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Progress dots */}
            <div
                style={{
                    display: 'flex',
                    gap: 4,
                    padding: '10px 16px 0',
                }}
            >
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            height: 3,
                            flex: 1,
                            borderRadius: 99,
                            background: i <= stepIndex ? '#2563eb' : '#e2e8f0',
                            transition: 'background 0.3s',
                        }}
                    />
                ))}
            </div>

            {/* Body */}
            <div style={{ padding: '12px 16px 16px' }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: 13,
                        color: '#374151',
                        lineHeight: 1.6,
                    }}
                >
                    {step.content}
                </p>

                {/* Actions */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 14,
                        gap: 8,
                    }}
                >
                    {!isFirst ? (
                        <button
                            onClick={onBack}
                            style={{
                                background: 'none',
                                border: '1px solid #e2e8f0',
                                borderRadius: 8,
                                padding: '6px 14px',
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#6b7280',
                                cursor: 'pointer',
                            }}
                        >
                            ← Kembali
                        </button>
                    ) : (
                        <button
                            onClick={onSkip}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '6px 0',
                                fontSize: 12,
                                fontWeight: 500,
                                color: '#9ca3af',
                                cursor: 'pointer',
                            }}
                        >
                            Lewati
                        </button>
                    )}

                    <button
                        onClick={onNext}
                        style={{
                            background:
                                'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                            border: 'none',
                            borderRadius: 8,
                            padding: '7px 18px',
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#fff',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
                        }}
                    >
                        {isLast ? 'Selesai ✓' : 'Lanjut →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main ProductTour Component ──────────────────────────────────────────────

type ProductTourProps = {
    steps: TourStep[];
    storageKey: string; // localStorage key unik per halaman
    /** Tambahkan delay (ms) jika halaman butuh waktu render sebelum spotlight bisa menemukan elemen */
    startDelay?: number;
};

export default function ProductTour({
    steps,
    storageKey,
    startDelay = 600,
}: ProductTourProps) {
    const [active, setActive] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [rect, setRect] = useState<Rect | null>(null);
    const [animKey, setAnimKey] = useState(0);
    const rafRef = useRef<number | null>(null);

    // ── Mount: cek localStorage ──────────────────────────────────────────────
    useEffect(() => {
        const seen = localStorage.getItem(storageKey);

        if (!seen) {
            const t = setTimeout(() => setActive(true), startDelay);

            return () => clearTimeout(t);
        }
    }, [storageKey, startDelay]);

    // ── Inject keyframe CSS once ─────────────────────────────────────────────
    useEffect(() => {
        const id = 'product-tour-styles';

        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = `
                @keyframes tour-pop {
                    0%   { opacity: 0; transform: scale(0.88) translateY(6px); }
                    100% { opacity: 1; transform: scale(1)    translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // ── Scroll target element into view & measure rect ───────────────────────
    const measureStep = useCallback(
        (index: number) => {
            const step = steps[index];
            const el = document.querySelector(
                step.target,
            ) as HTMLElement | null;

            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Wait for scroll, then measure
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = window.setTimeout(() => {
                setRect(getRect(step.target));
                setAnimKey((k) => k + 1);
            }, 350) as unknown as number;
        },
        [steps],
    );

    useEffect(() => {
        if (active) {
            measureStep(stepIndex);
        }
    }, [active, stepIndex, measureStep]);

    // ── Window resize: re-measure ────────────────────────────────────────────
    useEffect(() => {
        if (!active) {
            return;
        }

        const onResize = () => measureStep(stepIndex);
        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, [active, stepIndex, measureStep]);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    const finish = useCallback(() => {
        setActive(false);
        localStorage.setItem(storageKey, 'true');
    }, [storageKey]);

    const next = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex((i) => i + 1);
        } else {
            finish();
        }
    };

    const back = () => {
        if (stepIndex > 0) {
            setStepIndex((i) => i - 1);
        }
    };

    if (!active) {
        return null;
    }

    return createPortal(
        <>
            <SpotlightOverlay rect={rect} onSkip={finish} />
            <Tooltip
                step={steps[stepIndex]}
                stepIndex={stepIndex}
                totalSteps={steps.length}
                rect={rect}
                onNext={next}
                onBack={back}
                onSkip={finish}
                animKey={animKey}
            />
        </>,
        document.body,
    );
}
