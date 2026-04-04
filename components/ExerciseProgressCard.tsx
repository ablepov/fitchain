"use client";

import { type CSSProperties, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatRelativeTimeFromNow } from "@/lib/date";
import { cn } from "@/lib/utils";
import styles from "./ExerciseProgressCard.module.css";

const DEMO_TOKEN = "●";
const BUFFER_MS = 4200;
const TICK_MS = 50;
const TOKEN_SIZE = 22;
const MAX_PENDING = 18;
const DROP_IMPACT_PROGRESS = 0.78;

type MotionPhase = "launch" | "hold" | "drop" | "removePending" | "removeCommitted";
type CounterDirection = "up" | "down";
type HoldPattern = "grid";
type FloatPreset = "drift" | "hover" | "orbit" | "bob" | "flutter";
type Point = {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
};

type SceneMetrics = {
  width: number;
  height: number;
};

type TokenModel = {
  id: string;
  phase: MotionPhase;
  x: number;
  y: number;
  from: Point;
  to: Point;
  motionKey: number;
  motionIndex: number;
  motionTotal: number;
  zOrder: number;
};

type ArcTuning = {
  duration: number;
  lift: number;
  side: number;
  overshootX: number;
  overshootY: number;
  rotateStart: number;
  rotateMid: number;
  rotateEnd: number;
  easing: string;
  introScale: number;
  midScale: number;
  settleScale: number;
};

type DropTuning = {
  duration: number;
  preLift: number;
  lift: number;
  side: number;
  kickX: number;
  overshootX: number;
  overshootY: number;
  rotateKick: number;
  rotateMid: number;
  rotateEnd: number;
  easing: string;
  impactScale: number;
};

type ReturnTuning = {
  duration: number;
  dip: number;
  side: number;
  overshootX: number;
  overshootY: number;
  rotateStart: number;
  rotateMid: number;
  rotateEnd: number;
  easing: string;
  exitScale: number;
  fadeTo: number;
};

type CounterTuning = {
  duration: number;
  scale: number;
  recoil: number;
  rotate: number;
  shiftY: number;
  shiftX: number;
};

type MotionParams = {
  start: Point;
  end: Point;
  index: number;
  total: number;
  metrics: SceneMetrics;
};

type MotionRecipe = {
  keyframes: Keyframe[];
  duration: number;
  easing: string;
};

type MotionConfig = {
  holdPattern: HoldPattern;
  floatPreset: FloatPreset;
  spawnGap: number;
  drainGap: number;
  launch: ArcTuning;
  drop: DropTuning;
  removePending: ReturnTuning;
  removeCommitted: ReturnTuning;
  counter: CounterTuning;
};

type SceneAnchors = {
  metrics: SceneMetrics;
  minus: Point;
  smart1: Point;
  smart2: Point;
  smart3: Point;
  plus1: Point;
  counter: Point;
  holdCenterX: number;
  holdCenterY: number;
};

type SourceKey = "smart1" | "smart2" | "smart3" | "plus1";

type ThemeConfig = {
  accent: string;
  accentStrong: string;
  accentSoft: string;
  glow: string;
  surfaceStart: string;
  surfaceEnd: string;
  sceneStart: string;
  sceneEnd: string;
};

export type ExerciseProgressCardProps = {
  exercise: string;
  current: number;
  target: number;
  recentReps?: number[];
  chart?: number[];
  lastSetTime?: string | null;
  onCommit?: (reps: number) => void | Promise<void>;
  className?: string;
  theme?: Partial<ThemeConfig>;
};

const DEFAULT_THEME: ThemeConfig = {
  accent: "#74d8ff",
  accentStrong: "#def7ff",
  accentSoft: "rgba(116, 216, 255, 0.18)",
  glow: "rgba(116, 216, 255, 0.34)",
  surfaceStart: "rgba(8, 22, 35, 0.98)",
  surfaceEnd: "rgba(3, 7, 12, 0.98)",
  sceneStart: "rgba(7, 20, 31, 0.98)",
  sceneEnd: "rgba(3, 9, 16, 0.98)",
};

const MOTION_CONFIG: MotionConfig = {
  holdPattern: "grid",
  floatPreset: "bob",
  spawnGap: 82,
  drainGap: 84,
  launch: {
    duration: 780,
    lift: 112,
    side: 20,
    overshootX: 8,
    overshootY: -9,
    rotateStart: -18,
    rotateMid: 8,
    rotateEnd: 4,
    easing: "cubic-bezier(0.2, 1, 0.24, 1)",
    introScale: 0.52,
    midScale: 1.14,
    settleScale: 0.92,
  },
  drop: {
    duration: 540,
    preLift: 8,
    lift: 56,
    side: 4,
    kickX: 0,
    overshootX: 0,
    overshootY: -8,
    rotateKick: 2,
    rotateMid: 4,
    rotateEnd: 0,
    easing: "cubic-bezier(0.06, 0.92, 0.18, 1)",
    impactScale: 1.24,
  },
  removePending: {
    duration: 430,
    dip: 24,
    side: 12,
    overshootX: -10,
    overshootY: 7,
    rotateStart: 0,
    rotateMid: -12,
    rotateEnd: -24,
    easing: "cubic-bezier(0.26, 0, 0.24, 1)",
    exitScale: 0.64,
    fadeTo: 0.18,
  },
  removeCommitted: {
    duration: 450,
    dip: 18,
    side: 18,
    overshootX: -7,
    overshootY: 6,
    rotateStart: 0,
    rotateMid: -18,
    rotateEnd: -30,
    easing: "cubic-bezier(0.18, 0.84, 0.22, 1)",
    exitScale: 0.55,
    fadeTo: 0.13,
  },
  counter: {
    duration: 460,
    scale: 1.18,
    recoil: 0.95,
    rotate: 3,
    shiftY: 7,
    shiftX: 3,
  },
};

const FLOAT_CLASS: Record<FloatPreset, string> = {
  drift: styles.floatDrift,
  hover: styles.floatHover,
  orbit: styles.floatOrbit,
  bob: styles.floatBob,
  flutter: styles.floatFlutter,
};

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }

  return sorted[mid];
}

function deriveSmartButtons(recentReps: number[]) {
  const middle = median(recentReps);

  if (!middle) {
    return [3, 5, 8] as const;
  }

  return [middle - 2, middle, middle + 2].map((value) => Math.max(1, value)) as [number, number, number];
}

function buildChartSeries(chart: number[] | undefined, recentReps: number[]) {
  const source = chart?.length ? chart : recentReps;

  if (source.length >= 2) {
    return source;
  }

  if (source.length === 1) {
    return [source[0], source[0] + 1];
  }

  return [3, 5, 8, 6, 9, 7];
}

function formatLastSetLabel(lastSetTime: string | null | undefined) {
  if (!lastSetTime) {
    return "Последний подход: еще не было";
  }

  return `Последний подход: ${formatRelativeTimeFromNow(lastSetTime)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function toPx(value: number) {
  return `${Math.round(value * 100) / 100}px`;
}

function transformOf(point: Point) {
  return `translate3d(${toPx(point.x)}, ${toPx(point.y)}, 0) scale(${point.scale ?? 1}) rotate(${point.rotate ?? 0}deg)`;
}

function motionFrame(point: Point, offset?: number, filter?: string): Keyframe {
  const frame: Keyframe = {
    transform: transformOf(point),
    opacity: point.opacity ?? 1,
  };

  if (typeof offset === "number") {
    frame.offset = offset;
  }

  if (filter) {
    frame.filter = filter;
  }

  return frame;
}

function directionFor(index: number, total: number) {
  if (total <= 1) {
    return index % 2 === 0 ? 1 : -1;
  }

  const normalized = index / Math.max(total - 1, 1) - 0.5;
  if (normalized === 0) {
    return index % 2 === 0 ? 1 : -1;
  }

  return Math.sign(normalized);
}

function buildLaunchMotion(params: MotionParams, tuning: ArcTuning): MotionRecipe {
  const direction = directionFor(params.index, params.total);
  const offsetRatio = params.total <= 1 ? 0 : params.index / Math.max(params.total - 1, 1) - 0.5;
  const lift = Math.min(params.metrics.height * 0.35, tuning.lift + Math.abs(offsetRatio) * 18);
  const lateral = tuning.side * direction + offsetRatio * 18;

  return {
    duration: tuning.duration,
    easing: tuning.easing,
    keyframes: [
      motionFrame({ ...params.start, scale: tuning.introScale, rotate: tuning.rotateStart * direction, opacity: 0 }, 0, "blur(10px)"),
      motionFrame(
        {
          x: mix(params.start.x, params.end.x, 0.18),
          y: params.start.y - lift * 0.28,
          scale: tuning.midScale,
          rotate: tuning.rotateStart * 0.45 * direction,
        },
        0.2,
        "blur(0px)"
      ),
      motionFrame(
        {
          x: mix(params.start.x, params.end.x, 0.56) + lateral,
          y: Math.min(params.start.y, params.end.y) - lift,
          scale: 1.04,
          rotate: tuning.rotateMid * direction,
        },
        0.62
      ),
      motionFrame(
        {
          x: params.end.x + tuning.overshootX * direction,
          y: params.end.y + tuning.overshootY,
          scale: tuning.settleScale,
          rotate: tuning.rotateEnd * direction,
        },
        0.86
      ),
      motionFrame({ ...params.end, scale: 1, rotate: 0, opacity: 1 }, 1, "blur(0px)"),
    ],
  };
}

function buildDropMotion(params: MotionParams, tuning: DropTuning): MotionRecipe {
  const direction = directionFor(params.index, params.total);
  const offsetRatio = params.total <= 1 ? 0 : params.index / Math.max(params.total - 1, 1) - 0.5;
  const lift = Math.min(params.metrics.height * 0.24, tuning.lift + Math.abs(offsetRatio) * 10);

  return {
    duration: tuning.duration,
    easing: tuning.easing,
    keyframes: [
      motionFrame({ ...params.start, scale: 1, rotate: 0, opacity: 1 }, 0),
      motionFrame(
        {
          x: params.start.x + tuning.kickX * direction,
          y: params.start.y - tuning.preLift,
          scale: 1.08,
          rotate: tuning.rotateKick * direction,
        },
        0.16
      ),
      motionFrame(
        {
          x: mix(params.start.x, params.end.x, 0.45) + tuning.side * direction + offsetRatio * 14,
          y: params.start.y - lift,
          scale: 0.96,
          rotate: tuning.rotateMid * direction,
        },
        0.46
      ),
      motionFrame(
        {
          x: params.end.x + tuning.overshootX * direction,
          y: params.end.y + tuning.overshootY,
          scale: tuning.impactScale,
          rotate: tuning.rotateEnd * direction,
        },
        0.84
      ),
      motionFrame({ x: params.end.x, y: params.end.y, scale: 0.2, rotate: 0, opacity: 0 }, 1, "blur(3px)"),
    ],
  };
}

function buildReturnMotion(params: MotionParams, tuning: ReturnTuning): MotionRecipe {
  const direction = params.end.x < params.start.x ? -1 : 1;

  return {
    duration: tuning.duration,
    easing: tuning.easing,
    keyframes: [
      motionFrame({ ...params.start, scale: 1, rotate: tuning.rotateStart, opacity: 1 }, 0),
      motionFrame(
        {
          x: mix(params.start.x, params.end.x, 0.26) + tuning.side * direction,
          y: params.start.y + tuning.dip,
          scale: 1.06,
          rotate: tuning.rotateMid * direction,
        },
        0.34
      ),
      motionFrame(
        {
          x: params.end.x + tuning.overshootX,
          y: params.end.y + tuning.overshootY,
          scale: tuning.exitScale,
          rotate: tuning.rotateEnd * direction,
          opacity: 0.82,
        },
        0.8
      ),
      motionFrame(
        {
          x: params.end.x,
          y: params.end.y,
          scale: 0.24,
          rotate: tuning.rotateEnd * direction,
          opacity: tuning.fadeTo,
        },
        1,
        "blur(6px)"
      ),
    ],
  };
}

function buildCounterMotion(direction: CounterDirection, tuning: CounterTuning): MotionRecipe {
  const shiftY = direction === "up" ? -tuning.shiftY : tuning.shiftY * 0.8;
  const shiftX = direction === "up" ? tuning.shiftX : -tuning.shiftX;
  const primaryScale = direction === "up" ? tuning.scale : tuning.recoil;
  const secondaryScale = direction === "up" ? tuning.recoil : tuning.scale;
  const rotate = direction === "up" ? tuning.rotate : -tuning.rotate;

  return {
    duration: tuning.duration,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    keyframes: [
      { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
      {
        offset: 0.24,
        transform: `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${primaryScale}) rotate(${rotate}deg)`,
      },
      {
        offset: 0.56,
        transform: `translate3d(${-shiftX * 0.72}px, ${-shiftY * 0.42}px, 0) scale(${secondaryScale}) rotate(${-rotate * 0.7}deg)`,
      },
      { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
    ],
  };
}

function getHoldPoint(_pattern: HoldPattern, index: number, total: number, anchors: SceneAnchors): Point {
  const maxColumns = 10;
  const gapX = 6;
  const gapY = 8;
  const rowIndex = Math.floor(index / maxColumns);
  const rowOffset = index % maxColumns;
  const totalRows = Math.max(1, Math.ceil(total / maxColumns));
  const rowCount =
    rowIndex === totalRows - 1 ? total - rowIndex * maxColumns || Math.min(total, maxColumns) : Math.min(total, maxColumns);
  const rowWidth = rowCount * TOKEN_SIZE + Math.max(0, rowCount - 1) * gapX;
  const blockHeight = totalRows * TOKEN_SIZE + Math.max(0, totalRows - 1) * gapY;
  const startX = anchors.holdCenterX - rowWidth / 2;
  const startY = anchors.holdCenterY - blockHeight / 2;
  const x = startX + rowOffset * (TOKEN_SIZE + gapX);
  const y = startY + rowIndex * (TOKEN_SIZE + gapY);

  return {
    x: clamp(x, 14, anchors.metrics.width - TOKEN_SIZE - 14),
    y: clamp(y, 124, anchors.metrics.height - 124),
  };
}

function BackgroundChart({ values }: { values: number[] }) {
  const gradientId = useId();
  const width = 240;
  const height = 220;
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = (index * width) / Math.max(values.length - 1, 1);
    const y = height - (value / max) * (height * 0.9);

    return { x, y };
  });

  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPoints = `0,${height} ${points.map((point) => `${point.x},${point.y}`).join(" ")} ${width},${height}`;

  return (
    <div className={styles.sceneChart} aria-hidden="true">
      <svg className={styles.sceneChartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <path d={pathData} className={styles.sceneChartPath} />
      </svg>
    </div>
  );
}

function AnimatedToken({
  token,
  metrics,
  onMotionComplete,
}: {
  token: TokenModel;
  metrics: SceneMetrics;
  onMotionComplete: (id: string, phase: MotionPhase) => void;
}) {
  const shellRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = shellRef.current;
    if (!element) {
      return;
    }

    let recipe: MotionRecipe | null = null;
    const params: MotionParams = {
      start: token.from,
      end: token.to,
      index: token.motionIndex,
      total: token.motionTotal || 1,
      metrics,
    };

    if (token.phase === "launch") {
      recipe = buildLaunchMotion(params, MOTION_CONFIG.launch);
    }

    if (token.phase === "drop") {
      recipe = buildDropMotion(params, MOTION_CONFIG.drop);
    }

    if (token.phase === "removePending") {
      recipe = buildReturnMotion(params, MOTION_CONFIG.removePending);
    }

    if (token.phase === "removeCommitted") {
      recipe = buildReturnMotion(params, MOTION_CONFIG.removeCommitted);
    }

    if (!recipe) {
      return;
    }

    const animation = element.animate(recipe.keyframes, {
      duration: recipe.duration,
      easing: recipe.easing,
      fill: "both",
    });

    animation.onfinish = () => {
      onMotionComplete(token.id, token.phase);
    };

    return () => {
      animation.cancel();
    };
  }, [metrics, onMotionComplete, token.from, token.id, token.motionIndex, token.motionKey, token.motionTotal, token.phase, token.to]);

  return (
    <span
      ref={shellRef}
      className={styles.tokenShell}
      style={{
        transform: transformOf({ x: token.x, y: token.y }),
        zIndex: token.phase === "drop" ? 12 : 5 + token.zOrder,
      }}
    >
      <span className={cn(styles.tokenBody, token.phase === "hold" && styles.tokenHold, token.phase === "hold" && FLOAT_CLASS[MOTION_CONFIG.floatPreset])}>
        {DEMO_TOKEN}
      </span>
    </span>
  );
}

export function ExerciseProgressCard({
  exercise,
  current,
  target,
  recentReps = [],
  chart,
  lastSetTime = null,
  onCommit,
  className,
  theme,
}: ExerciseProgressCardProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const impactRef = useRef<HTMLSpanElement | null>(null);
  const minusRef = useRef<HTMLButtonElement | null>(null);
  const smartOneRef = useRef<HTMLButtonElement | null>(null);
  const smartTwoRef = useRef<HTMLButtonElement | null>(null);
  const smartThreeRef = useRef<HTMLButtonElement | null>(null);
  const plusOneRef = useRef<HTMLButtonElement | null>(null);

  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [committedTotal, setCommittedTotal] = useState(current);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [layoutTick, setLayoutTick] = useState(0);
  const [counterPulseTick, setCounterPulseTick] = useState(0);
  const [counterDirection, setCounterDirection] = useState<CounterDirection>("up");

  const sequenceRef = useRef(0);
  const timeoutIdsRef = useRef<number[]>([]);
  const timerDeadlineRef = useRef<number | null>(null);
  const anchorsRef = useRef<SceneAnchors | null>(null);
  const pendingIdsRef = useRef<string[]>([]);
  const commitLockRef = useRef(false);
  const commitRemainingRef = useRef(0);

  const buttonValues = useMemo(() => deriveSmartButtons(recentReps), [recentReps]);
  const chartValues = useMemo(() => buildChartSeries(chart, recentReps), [chart, recentReps]);
  const lastSetLabel = useMemo(() => formatLastSetLabel(lastSetTime), [lastSetTime]);
  const palette = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme]);
  const actualProgress = clamp((committedTotal / target) * 100, 0, 100);
  const projectedProgress = clamp(((committedTotal + pendingIds.length) / target) * 100, 0, 100);
  const remaining = Math.max(0, target - committedTotal);

  useEffect(() => {
    setCommittedTotal(current);
  }, [current]);

  const clearQueuedTimeouts = useCallback(() => {
    for (const timeoutId of timeoutIdsRef.current) {
      window.clearTimeout(timeoutId);
    }
    timeoutIdsRef.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter((value) => value !== timeoutId);
      callback();
    }, delay);

    timeoutIdsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  const measureScene = useCallback(() => {
    if (
      !sceneRef.current ||
      !impactRef.current ||
      !minusRef.current ||
      !smartOneRef.current ||
      !smartTwoRef.current ||
      !smartThreeRef.current ||
      !plusOneRef.current ||
      !headlineRef.current
    ) {
      return;
    }

    const sceneRect = sceneRef.current.getBoundingClientRect();

    const toPoint = (element: HTMLElement): Point => {
      const rect = element.getBoundingClientRect();

      return {
        x: rect.left - sceneRect.left + rect.width / 2 - TOKEN_SIZE / 2,
        y: rect.top - sceneRect.top + rect.height / 2 - TOKEN_SIZE / 2,
      };
    };

    const progressRect = impactRef.current.getBoundingClientRect();
    const controlsRect = smartTwoRef.current.getBoundingClientRect();
    const progressBottom = progressRect.bottom - sceneRect.top;
    const controlsTop = controlsRect.top - sceneRect.top;
    const zoneTop = progressBottom + 26;
    const zoneBottom = controlsTop - TOKEN_SIZE - 18;

    anchorsRef.current = {
      metrics: {
        width: sceneRect.width,
        height: sceneRect.height,
      },
      minus: toPoint(minusRef.current),
      smart1: toPoint(smartOneRef.current),
      smart2: toPoint(smartTwoRef.current),
      smart3: toPoint(smartThreeRef.current),
      plus1: toPoint(plusOneRef.current),
      counter: toPoint(impactRef.current),
      holdCenterX: sceneRect.width / 2 - TOKEN_SIZE / 2,
      holdCenterY: clamp((zoneTop + zoneBottom) / 2, zoneTop, Math.max(zoneTop, zoneBottom)),
    };

    setIsReady(true);
    setLayoutTick((current) => current + 1);
  }, []);

  useEffect(() => {
    measureScene();

    if (!sceneRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureScene();
    });

    observer.observe(sceneRef.current);
    window.addEventListener("resize", measureScene);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureScene);
    };
  }, [measureScene]);

  useEffect(() => {
    measureScene();
  }, [actualProgress, measureScene]);

  useEffect(() => {
    return () => {
      clearQueuedTimeouts();
    };
  }, [clearQueuedTimeouts]);

  useEffect(() => {
    const anchors = anchorsRef.current;
    if (!anchors) {
      return;
    }

    setTokens((current) =>
      current.map((token) => {
        if (token.phase !== "hold") {
          return token;
        }

        const nextIndex = pendingIds.indexOf(token.id);
        if (nextIndex === -1) {
          return token;
        }

        const nextPoint = getHoldPoint(MOTION_CONFIG.holdPattern, nextIndex, pendingIds.length, anchors);
        if (Math.abs(nextPoint.x - token.x) < 0.5 && Math.abs(nextPoint.y - token.y) < 0.5) {
          return token;
        }

        return {
          ...token,
          x: nextPoint.x,
          y: nextPoint.y,
          from: nextPoint,
          to: nextPoint,
        };
      })
    );
  }, [layoutTick, pendingIds]);

  const pulseCounter = useCallback((direction: CounterDirection) => {
    setCounterDirection(direction);
    setCounterPulseTick((current) => current + 1);
  }, []);

  useEffect(() => {
    if (counterPulseTick === 0 || !headlineRef.current) {
      return;
    }

    const motion = buildCounterMotion(counterDirection, MOTION_CONFIG.counter);
    const textAnimation = headlineRef.current.animate(motion.keyframes, {
      duration: motion.duration,
      easing: motion.easing,
      fill: "both",
    });

    const dotAnimation = impactRef.current?.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { offset: 0.4, transform: "translate(-50%, -50%) scale(1.45)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
      ],
      {
        duration: motion.duration,
        easing: motion.easing,
        fill: "both",
      }
    );

    return () => {
      textAnimation.cancel();
      dotAnimation?.cancel();
    };
  }, [counterDirection, counterPulseTick]);

  const resetTimer = useCallback(() => {
    if (pendingIdsRef.current.length === 0 || commitLockRef.current) {
      timerDeadlineRef.current = null;
      setTimeLeftMs(0);
      return;
    }

    timerDeadlineRef.current = Date.now() + BUFFER_MS;
    setTimeLeftMs(BUFFER_MS);
  }, []);

  const finishCommit = useCallback(() => {
    commitLockRef.current = false;
    commitRemainingRef.current = 0;
    setIsCommitting(false);
    timerDeadlineRef.current = null;
    setTimeLeftMs(0);
  }, []);

  const startCommit = useCallback(() => {
    const anchors = anchorsRef.current;
    const commitIds = [...pendingIdsRef.current];

    if (commitLockRef.current || commitIds.length === 0 || !anchors) {
      return;
    }

    commitLockRef.current = true;
    commitRemainingRef.current = commitIds.length;
    setIsCommitting(true);
    pendingIdsRef.current = [];
    setPendingIds([]);
    timerDeadlineRef.current = null;
    setTimeLeftMs(0);

    Promise.resolve(onCommit?.(commitIds.length)).catch(() => undefined);

    const staggerMs = clamp(Math.round(1200 / commitIds.length), 40, MOTION_CONFIG.drainGap);
    const impactDelayMs = Math.round(MOTION_CONFIG.drop.duration * DROP_IMPACT_PROGRESS);

    commitIds.forEach((tokenId, index) => {
      schedule(() => {
        const nextTarget = anchorsRef.current?.counter ?? anchors.counter;

        setTokens((current) =>
          current.map((token) => {
            if (token.id !== tokenId) {
              return token;
            }

            return {
              ...token,
              phase: "drop",
              from: { x: token.x, y: token.y },
              to: nextTarget,
              motionKey: token.motionKey + 1,
              motionIndex: index,
              motionTotal: commitIds.length,
            };
          })
        );
      }, index * staggerMs);

      schedule(() => {
        setCommittedTotal((current) => current + 1);
        pulseCounter("up");
      }, index * staggerMs + impactDelayMs);
    });
  }, [onCommit, pulseCounter, schedule]);

  useEffect(() => {
    if (isCommitting || pendingIds.length === 0) {
      if (!isCommitting) {
        timerDeadlineRef.current = null;
        setTimeLeftMs(0);
      }
      return;
    }

    if (!timerDeadlineRef.current) {
      timerDeadlineRef.current = Date.now() + BUFFER_MS;
      setTimeLeftMs(BUFFER_MS);
    }

    const intervalId = window.setInterval(() => {
      const deadline = timerDeadlineRef.current;
      if (!deadline) {
        setTimeLeftMs(0);
        return;
      }

      const nextLeft = Math.max(0, deadline - Date.now());
      setTimeLeftMs(nextLeft);

      if (nextLeft <= 0) {
        window.clearInterval(intervalId);
        startCommit();
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isCommitting, pendingIds.length, startCommit]);

  const makeTokenId = useCallback(() => {
    sequenceRef.current += 1;
    return `push-up-${sequenceRef.current}`;
  }, []);

  const spawnToken = useCallback(
    (source: SourceKey) => {
      const anchors = anchorsRef.current;
      if (!anchors) {
        return;
      }

      const id = makeTokenId();
      const pendingCount = pendingIdsRef.current.length;
      const nextTotal = pendingCount + 1;
      const holdPoint = getHoldPoint(MOTION_CONFIG.holdPattern, pendingCount, nextTotal, anchors);
      const startPoint = anchors[source];
      const nextPendingIds = [...pendingIdsRef.current, id];

      pendingIdsRef.current = nextPendingIds;

      setTokens((current) => [
        ...current,
        {
          id,
          phase: "launch",
          x: startPoint.x,
          y: startPoint.y,
          from: startPoint,
          to: holdPoint,
          motionKey: 0,
          motionIndex: pendingCount,
          motionTotal: nextTotal,
          zOrder: sequenceRef.current,
        },
      ]);
      setPendingIds(nextPendingIds);
      resetTimer();
    },
    [makeTokenId, resetTimer]
  );

  const handleAdd = useCallback(
    (amount: number, source: SourceKey) => {
      if (!isReady || isCommitting) {
        return;
      }

      const available = Math.max(0, MAX_PENDING - pendingIdsRef.current.length);
      const count = Math.min(amount, available);
      if (count <= 0) {
        return;
      }

      for (let index = 0; index < count; index += 1) {
        const delay = index * MOTION_CONFIG.spawnGap;
        schedule(() => {
          spawnToken(source);
        }, delay);
      }
    },
    [isCommitting, isReady, schedule, spawnToken]
  );

  const handleMinus = useCallback(() => {
    if (!isReady || isCommitting) {
      return;
    }

    const anchors = anchorsRef.current;
    if (!anchors) {
      return;
    }

    const pendingId = pendingIdsRef.current.at(-1);
    if (pendingId) {
      const nextPendingIds = pendingIdsRef.current.slice(0, -1);
      pendingIdsRef.current = nextPendingIds;
      setPendingIds(nextPendingIds);
      setTokens((current) =>
        current.map((token) => {
          if (token.id !== pendingId) {
            return token;
          }

          return {
            ...token,
            phase: "removePending",
            from: { x: token.x, y: token.y },
            to: anchors.minus,
            motionKey: token.motionKey + 1,
            motionIndex: 0,
            motionTotal: 1,
          };
        })
      );

      if (pendingIdsRef.current.length === 1) {
        timerDeadlineRef.current = null;
        setTimeLeftMs(0);
      } else {
        resetTimer();
      }

      return;
    }

    if (committedTotal <= 0) {
      return;
    }

    const id = makeTokenId();
    const startPoint = anchorsRef.current?.counter ?? anchors.counter;

    setTokens((current) => [
      ...current,
      {
        id,
        phase: "removeCommitted",
        x: startPoint.x,
        y: startPoint.y,
        from: startPoint,
        to: anchors.minus,
        motionKey: 0,
        motionIndex: 0,
        motionTotal: 1,
        zOrder: sequenceRef.current,
      },
    ]);
  }, [committedTotal, isCommitting, isReady, makeTokenId, resetTimer]);

  const handleMotionComplete = useCallback(
    (id: string, phase: MotionPhase) => {
      if (phase === "launch") {
        const anchors = anchorsRef.current;
        const nextIndex = pendingIdsRef.current.indexOf(id);
        setTokens((current) =>
          current.map((token) => {
            if (token.id !== id) {
              return token;
            }

            const holdPoint =
              anchors && nextIndex !== -1
                ? getHoldPoint(MOTION_CONFIG.holdPattern, nextIndex, pendingIdsRef.current.length, anchors)
                : token.to;

            return {
              ...token,
              phase: "hold",
              x: holdPoint.x,
              y: holdPoint.y,
              from: holdPoint,
              to: holdPoint,
              motionIndex: 0,
              motionTotal: 1,
            };
          })
        );
        return;
      }

      if (phase === "drop") {
        setTokens((current) => current.filter((token) => token.id !== id));
        commitRemainingRef.current = Math.max(0, commitRemainingRef.current - 1);
        if (commitRemainingRef.current === 0) {
          finishCommit();
        }
        return;
      }

      if (phase === "removePending") {
        setTokens((current) => current.filter((token) => token.id !== id));
        if (pendingIdsRef.current.length === 0) {
          timerDeadlineRef.current = null;
          setTimeLeftMs(0);
        }
        return;
      }

      if (phase === "removeCommitted") {
        setTokens((current) => current.filter((token) => token.id !== id));
        setCommittedTotal((current) => Math.max(0, current - 1));
        pulseCounter("down");
      }
    },
    [finishCommit, pulseCounter]
  );

  const themeStyle = useMemo(
    () =>
      ({
        "--card-accent": palette.accent,
        "--card-accent-strong": palette.accentStrong,
        "--card-accent-soft": palette.accentSoft,
        "--card-glow": palette.glow,
        "--card-surface-start": palette.surfaceStart,
        "--card-surface-end": palette.surfaceEnd,
        "--scene-start": palette.sceneStart,
        "--scene-end": palette.sceneEnd,
      }) as CSSProperties,
    [palette]
  );

  const buttonStyle = useMemo(
    () =>
      ({
        background: `linear-gradient(135deg, ${palette.accentStrong}, ${palette.accent})`,
      }) as CSSProperties,
    [palette]
  );

  return (
    <div className={cn(styles.shell, className)}>
      <article className={styles.card} style={themeStyle}>
        <div ref={sceneRef} className={styles.scene}>
          <BackgroundChart values={chartValues} />

          <div className={styles.header}>
            <div className={styles.titleRow}>
              <h1 className={styles.exerciseName}>{exercise}</h1>
              <div className={styles.remainingChip}>
                <span>Осталось</span>
                <strong>{remaining}</strong>
              </div>
            </div>

            <div ref={headlineRef} className={styles.progressValue}>
              <span className={styles.progressDone}>{committedTotal}</span>
              <span className={styles.progressDivider}>/</span>
              <span className={styles.progressGoal}>{target}</span>
            </div>

            <div className={styles.progressBar}>
              <div className={styles.progressProjectedFill} style={{ width: `${projectedProgress}%` }} />
              <div className={styles.progressActualFill} style={{ width: `${actualProgress}%` }} />
              <span ref={impactRef} className={styles.progressImpactDot} style={{ left: `${actualProgress}%` }} />
            </div>
          </div>

          <div className={styles.holdZone} />

          {tokens.map((token) => (
            <AnimatedToken
              key={token.id}
              token={token}
              metrics={anchorsRef.current?.metrics ?? { width: 320, height: 420 }}
              onMotionComplete={handleMotionComplete}
            />
          ))}

          <div className={styles.controls}>
            <Button
              ref={minusRef}
              variant="outline"
              className={cn(styles.controlButton, styles.minusButton)}
              onClick={handleMinus}
              disabled={!isReady || isCommitting || (pendingIds.length === 0 && committedTotal === 0)}
            >
              -1
            </Button>
            <Button
              ref={smartOneRef}
              className={cn(styles.controlButton, styles.smartButton)}
              style={buttonStyle}
              onClick={() => handleAdd(buttonValues[0], "smart1")}
              disabled={!isReady || isCommitting || pendingIds.length >= MAX_PENDING}
            >
              +{buttonValues[0]}
            </Button>
            <Button
              ref={smartTwoRef}
              className={cn(styles.controlButton, styles.smartButton)}
              style={buttonStyle}
              onClick={() => handleAdd(buttonValues[1], "smart2")}
              disabled={!isReady || isCommitting || pendingIds.length >= MAX_PENDING}
            >
              +{buttonValues[1]}
            </Button>
            <Button
              ref={smartThreeRef}
              className={cn(styles.controlButton, styles.smartButton)}
              style={buttonStyle}
              onClick={() => handleAdd(buttonValues[2], "smart3")}
              disabled={!isReady || isCommitting || pendingIds.length >= MAX_PENDING}
            >
              +{buttonValues[2]}
            </Button>
            <Button
              ref={plusOneRef}
              variant="secondary"
              className={cn(styles.controlButton, styles.plusOneButton)}
              onClick={() => handleAdd(1, "plus1")}
              disabled={!isReady || isCommitting || pendingIds.length >= MAX_PENDING}
            >
              +1
            </Button>

            <div className={styles.lastSet}>{lastSetLabel}</div>
          </div>
        </div>
      </article>
    </div>
  );
}
