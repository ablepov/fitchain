"use client";

import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import styles from "./SetAnimationLab.module.css";

const DEMO_EMOJI = "💩";
const BUFFER_MS = 4200;
const TICK_MS = 50;
const TOKEN_SIZE = 34;
const MAX_PENDING = 18;

type MotionPhase = "launch" | "hold" | "drop" | "removePending" | "removeCommitted";
type CounterDirection = "up" | "down";
type HoldPattern = "crown" | "orbit" | "wave" | "fan" | "zigzag" | "stack";
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

type VariantConfig = {
  id: string;
  name: string;
  badge: string;
  description: string;
  vibe: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  glow: string;
  bgStart: string;
  bgEnd: string;
  holdPattern: HoldPattern;
  floatPreset: FloatPreset;
  initialTotal: number;
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
  plus1: Point;
  plus3: Point;
  plus5: Point;
  counter: Point;
};

type SourceKey = "plus1" | "plus3" | "plus5";

const FLOAT_CLASS: Record<FloatPreset, string> = {
  drift: styles.floatDrift,
  hover: styles.floatHover,
  orbit: styles.floatOrbit,
  bob: styles.floatBob,
  flutter: styles.floatFlutter,
};

const VARIANTS: VariantConfig[] = [
  {
    id: "comet-arc",
    name: "Комета",
    badge: "1 / резкий старт",
    description: "Кнопка выстреливает эмодзи в верхнюю корону, а потом вся пачка быстро простреливает в общий счёт.",
    vibe: "Самый бодрый и спортивный.",
    accent: "#ff7a00",
    accentStrong: "#ffd166",
    accentSoft: "rgba(255, 122, 0, 0.16)",
    glow: "rgba(255, 145, 77, 0.34)",
    bgStart: "rgba(22, 12, 0, 0.96)",
    bgEnd: "rgba(6, 6, 6, 0.98)",
    holdPattern: "crown",
    floatPreset: "drift",
    initialTotal: 18,
    spawnGap: 70,
    drainGap: 95,
    launch: {
      duration: 760,
      lift: 116,
      side: 32,
      overshootX: 10,
      overshootY: -10,
      rotateStart: -28,
      rotateMid: 16,
      rotateEnd: 8,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      introScale: 0.48,
      midScale: 1.2,
      settleScale: 0.9,
    },
    drop: {
      duration: 620,
      preLift: 18,
      lift: 42,
      side: 24,
      kickX: 6,
      overshootX: 8,
      overshootY: -3,
      rotateKick: 12,
      rotateMid: 18,
      rotateEnd: -14,
      easing: "cubic-bezier(0.06, 0.88, 0.18, 1)",
      impactScale: 1.22,
    },
    removePending: {
      duration: 430,
      dip: 20,
      side: 18,
      overshootX: -10,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -16,
      rotateEnd: -32,
      easing: "cubic-bezier(0.25, 0, 0.22, 1)",
      exitScale: 0.64,
      fadeTo: 0.16,
    },
    removeCommitted: {
      duration: 440,
      dip: 18,
      side: 22,
      overshootX: -8,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -22,
      rotateEnd: -38,
      easing: "cubic-bezier(0.16, 0.84, 0.24, 1)",
      exitScale: 0.52,
      fadeTo: 0.12,
    },
    counter: {
      duration: 420,
      scale: 1.18,
      recoil: 0.94,
      rotate: 4,
      shiftY: 8,
      shiftX: 4,
    },
  },
  {
    id: "orbit-crown",
    name: "Орбита",
    badge: "2 / эллипс",
    description: "Поднятые эмодзи встают в мягкий верхний орбитальный круг и затем стекают в цифру почти как магнитные капли.",
    vibe: "Более премиальный и спокойный.",
    accent: "#1fd1a5",
    accentStrong: "#89ffe1",
    accentSoft: "rgba(31, 209, 165, 0.16)",
    glow: "rgba(31, 209, 165, 0.3)",
    bgStart: "rgba(0, 18, 15, 0.96)",
    bgEnd: "rgba(6, 8, 8, 0.98)",
    holdPattern: "orbit",
    floatPreset: "orbit",
    initialTotal: 24,
    spawnGap: 90,
    drainGap: 110,
    launch: {
      duration: 820,
      lift: 108,
      side: 42,
      overshootX: 14,
      overshootY: -8,
      rotateStart: -24,
      rotateMid: 10,
      rotateEnd: 4,
      easing: "cubic-bezier(0.2, 1, 0.25, 1)",
      introScale: 0.52,
      midScale: 1.14,
      settleScale: 0.94,
    },
    drop: {
      duration: 700,
      preLift: 12,
      lift: 52,
      side: 30,
      kickX: 4,
      overshootX: 10,
      overshootY: -6,
      rotateKick: 8,
      rotateMid: 10,
      rotateEnd: -10,
      easing: "cubic-bezier(0.12, 0.86, 0.18, 1)",
      impactScale: 1.16,
    },
    removePending: {
      duration: 460,
      dip: 28,
      side: 24,
      overshootX: -14,
      overshootY: 8,
      rotateStart: 0,
      rotateMid: -10,
      rotateEnd: -26,
      easing: "cubic-bezier(0.28, 0, 0.26, 1)",
      exitScale: 0.68,
      fadeTo: 0.18,
    },
    removeCommitted: {
      duration: 470,
      dip: 22,
      side: 26,
      overshootX: -10,
      overshootY: 7,
      rotateStart: 0,
      rotateMid: -18,
      rotateEnd: -32,
      easing: "cubic-bezier(0.18, 0.84, 0.24, 1)",
      exitScale: 0.56,
      fadeTo: 0.14,
    },
    counter: {
      duration: 470,
      scale: 1.16,
      recoil: 0.96,
      rotate: 3,
      shiftY: 6,
      shiftX: 3,
    },
  },
  {
    id: "liquid-wave",
    name: "Желе",
    badge: "3 / тянущееся",
    description: "Каждый полёт чуть тянется и пружинит, а цифра получает более мягкий, мясистый удар.",
    vibe: "Самый живой и липкий.",
    accent: "#ff6b57",
    accentStrong: "#ffb088",
    accentSoft: "rgba(255, 107, 87, 0.17)",
    glow: "rgba(255, 107, 87, 0.3)",
    bgStart: "rgba(22, 8, 6, 0.96)",
    bgEnd: "rgba(8, 6, 6, 0.98)",
    holdPattern: "wave",
    floatPreset: "hover",
    initialTotal: 12,
    spawnGap: 85,
    drainGap: 100,
    launch: {
      duration: 860,
      lift: 104,
      side: 26,
      overshootX: 12,
      overshootY: -12,
      rotateStart: -18,
      rotateMid: 14,
      rotateEnd: 6,
      easing: "cubic-bezier(0.22, 1, 0.18, 1)",
      introScale: 0.44,
      midScale: 1.28,
      settleScale: 0.86,
    },
    drop: {
      duration: 680,
      preLift: 16,
      lift: 44,
      side: 22,
      kickX: 5,
      overshootX: 9,
      overshootY: -5,
      rotateKick: 10,
      rotateMid: 16,
      rotateEnd: -12,
      easing: "cubic-bezier(0.12, 0.9, 0.14, 1)",
      impactScale: 1.26,
    },
    removePending: {
      duration: 450,
      dip: 24,
      side: 16,
      overshootX: -10,
      overshootY: 7,
      rotateStart: 0,
      rotateMid: -14,
      rotateEnd: -30,
      easing: "cubic-bezier(0.28, 0, 0.2, 1)",
      exitScale: 0.62,
      fadeTo: 0.2,
    },
    removeCommitted: {
      duration: 460,
      dip: 20,
      side: 18,
      overshootX: -8,
      overshootY: 7,
      rotateStart: 0,
      rotateMid: -20,
      rotateEnd: -34,
      easing: "cubic-bezier(0.18, 0.82, 0.22, 1)",
      exitScale: 0.54,
      fadeTo: 0.14,
    },
    counter: {
      duration: 520,
      scale: 1.22,
      recoil: 0.92,
      rotate: 5,
      shiftY: 10,
      shiftX: 5,
    },
  },
  {
    id: "fountain-fan",
    name: "Фонтан",
    badge: "4 / веер",
    description: "Добавление раскрывается веером, висит почти как победный салют и потом быстро щёлкает по счётчику.",
    vibe: "Наиболее праздничный.",
    accent: "#ffd447",
    accentStrong: "#fff3a3",
    accentSoft: "rgba(255, 212, 71, 0.16)",
    glow: "rgba(255, 212, 71, 0.32)",
    bgStart: "rgba(24, 18, 0, 0.96)",
    bgEnd: "rgba(8, 8, 5, 0.98)",
    holdPattern: "fan",
    floatPreset: "flutter",
    initialTotal: 31,
    spawnGap: 68,
    drainGap: 88,
    launch: {
      duration: 740,
      lift: 126,
      side: 50,
      overshootX: 18,
      overshootY: -14,
      rotateStart: -30,
      rotateMid: 20,
      rotateEnd: 10,
      easing: "cubic-bezier(0.12, 1, 0.24, 1)",
      introScale: 0.46,
      midScale: 1.22,
      settleScale: 0.88,
    },
    drop: {
      duration: 590,
      preLift: 22,
      lift: 58,
      side: 36,
      kickX: 8,
      overshootX: 11,
      overshootY: -3,
      rotateKick: 14,
      rotateMid: 22,
      rotateEnd: -16,
      easing: "cubic-bezier(0.05, 0.84, 0.18, 1)",
      impactScale: 1.24,
    },
    removePending: {
      duration: 410,
      dip: 18,
      side: 20,
      overshootX: -12,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -18,
      rotateEnd: -34,
      easing: "cubic-bezier(0.22, 0, 0.18, 1)",
      exitScale: 0.6,
      fadeTo: 0.17,
    },
    removeCommitted: {
      duration: 430,
      dip: 16,
      side: 22,
      overshootX: -8,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -22,
      rotateEnd: -36,
      easing: "cubic-bezier(0.16, 0.8, 0.24, 1)",
      exitScale: 0.52,
      fadeTo: 0.12,
    },
    counter: {
      duration: 420,
      scale: 1.2,
      recoil: 0.93,
      rotate: 5,
      shiftY: 8,
      shiftX: 5,
    },
  },
  {
    id: "halo-stack",
    name: "Стек",
    badge: "5 / вертикаль",
    description: "Очередь собирается почти в компактный тотем над сценой и затем по одной сваливается вниз с плотным ударом.",
    vibe: "Плотный и читаемый.",
    accent: "#56c9ff",
    accentStrong: "#b8ebff",
    accentSoft: "rgba(86, 201, 255, 0.16)",
    glow: "rgba(86, 201, 255, 0.3)",
    bgStart: "rgba(4, 15, 24, 0.96)",
    bgEnd: "rgba(5, 8, 10, 0.98)",
    holdPattern: "stack",
    floatPreset: "bob",
    initialTotal: 27,
    spawnGap: 82,
    drainGap: 92,
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
      duration: 610,
      preLift: 10,
      lift: 34,
      side: 10,
      kickX: 2,
      overshootX: 6,
      overshootY: -4,
      rotateKick: 6,
      rotateMid: 10,
      rotateEnd: -8,
      easing: "cubic-bezier(0.08, 0.9, 0.18, 1)",
      impactScale: 1.18,
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
  },
  {
    id: "zigzag-run",
    name: "Зигзаг",
    badge: "6 / ломаная",
    description: "Траектория чуть агрессивнее, с боковым рывком и быстрым хлёстким влетом в цифру.",
    vibe: "Для более дерзкого UI.",
    accent: "#9eff6a",
    accentStrong: "#d7ffb0",
    accentSoft: "rgba(158, 255, 106, 0.16)",
    glow: "rgba(158, 255, 106, 0.28)",
    bgStart: "rgba(10, 22, 2, 0.96)",
    bgEnd: "rgba(6, 9, 4, 0.98)",
    holdPattern: "zigzag",
    floatPreset: "hover",
    initialTotal: 15,
    spawnGap: 72,
    drainGap: 86,
    launch: {
      duration: 760,
      lift: 108,
      side: 56,
      overshootX: 15,
      overshootY: -10,
      rotateStart: -24,
      rotateMid: 20,
      rotateEnd: 8,
      easing: "cubic-bezier(0.16, 1, 0.24, 1)",
      introScale: 0.5,
      midScale: 1.18,
      settleScale: 0.88,
    },
    drop: {
      duration: 600,
      preLift: 14,
      lift: 36,
      side: 28,
      kickX: 8,
      overshootX: 10,
      overshootY: -2,
      rotateKick: 16,
      rotateMid: 20,
      rotateEnd: -18,
      easing: "cubic-bezier(0.04, 0.88, 0.16, 1)",
      impactScale: 1.2,
    },
    removePending: {
      duration: 420,
      dip: 22,
      side: 18,
      overshootX: -10,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -18,
      rotateEnd: -36,
      easing: "cubic-bezier(0.24, 0, 0.2, 1)",
      exitScale: 0.62,
      fadeTo: 0.16,
    },
    removeCommitted: {
      duration: 430,
      dip: 16,
      side: 20,
      overshootX: -8,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -22,
      rotateEnd: -38,
      easing: "cubic-bezier(0.16, 0.82, 0.2, 1)",
      exitScale: 0.5,
      fadeTo: 0.12,
    },
    counter: {
      duration: 410,
      scale: 1.16,
      recoil: 0.93,
      rotate: 6,
      shiftY: 7,
      shiftX: 6,
    },
  },
  {
    id: "soft-dome",
    name: "Купол",
    badge: "7 / мягкая дуга",
    description: "Верхняя зона выглядит как мягкий купол, а падение из неё даёт особенно приятный, почти физический отклик.",
    vibe: "Самый сбалансированный.",
    accent: "#ff9f6e",
    accentStrong: "#ffd2b5",
    accentSoft: "rgba(255, 159, 110, 0.16)",
    glow: "rgba(255, 159, 110, 0.3)",
    bgStart: "rgba(24, 12, 6, 0.96)",
    bgEnd: "rgba(8, 7, 6, 0.98)",
    holdPattern: "crown",
    floatPreset: "bob",
    initialTotal: 22,
    spawnGap: 78,
    drainGap: 96,
    launch: {
      duration: 800,
      lift: 100,
      side: 24,
      overshootX: 10,
      overshootY: -8,
      rotateStart: -16,
      rotateMid: 12,
      rotateEnd: 4,
      easing: "cubic-bezier(0.22, 1, 0.24, 1)",
      introScale: 0.54,
      midScale: 1.12,
      settleScale: 0.94,
    },
    drop: {
      duration: 660,
      preLift: 16,
      lift: 40,
      side: 16,
      kickX: 4,
      overshootX: 8,
      overshootY: -4,
      rotateKick: 8,
      rotateMid: 12,
      rotateEnd: -10,
      easing: "cubic-bezier(0.1, 0.88, 0.18, 1)",
      impactScale: 1.16,
    },
    removePending: {
      duration: 450,
      dip: 26,
      side: 18,
      overshootX: -10,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -12,
      rotateEnd: -26,
      easing: "cubic-bezier(0.26, 0, 0.24, 1)",
      exitScale: 0.66,
      fadeTo: 0.18,
    },
    removeCommitted: {
      duration: 460,
      dip: 18,
      side: 18,
      overshootX: -8,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -18,
      rotateEnd: -30,
      easing: "cubic-bezier(0.18, 0.82, 0.22, 1)",
      exitScale: 0.55,
      fadeTo: 0.13,
    },
    counter: {
      duration: 470,
      scale: 1.18,
      recoil: 0.95,
      rotate: 3,
      shiftY: 7,
      shiftX: 4,
    },
  },
  {
    id: "rocket-train",
    name: "Ракета",
    badge: "8 / быстрый поезд",
    description: "Пачка идёт коротким ракетным строем: подъём почти в одну линию, удержание наверху и серийный быстрый drop.",
    vibe: "Самый читаемый на высокой скорости.",
    accent: "#ff4d74",
    accentStrong: "#ff9ab0",
    accentSoft: "rgba(255, 77, 116, 0.16)",
    glow: "rgba(255, 77, 116, 0.3)",
    bgStart: "rgba(22, 4, 10, 0.96)",
    bgEnd: "rgba(8, 5, 7, 0.98)",
    holdPattern: "wave",
    floatPreset: "drift",
    initialTotal: 35,
    spawnGap: 56,
    drainGap: 72,
    launch: {
      duration: 700,
      lift: 120,
      side: 20,
      overshootX: 8,
      overshootY: -12,
      rotateStart: -22,
      rotateMid: 10,
      rotateEnd: 4,
      easing: "cubic-bezier(0.14, 1, 0.24, 1)",
      introScale: 0.42,
      midScale: 1.18,
      settleScale: 0.9,
    },
    drop: {
      duration: 520,
      preLift: 8,
      lift: 28,
      side: 12,
      kickX: 3,
      overshootX: 5,
      overshootY: -1,
      rotateKick: 6,
      rotateMid: 8,
      rotateEnd: -8,
      easing: "cubic-bezier(0.04, 0.92, 0.14, 1)",
      impactScale: 1.14,
    },
    removePending: {
      duration: 390,
      dip: 16,
      side: 14,
      overshootX: -8,
      overshootY: 5,
      rotateStart: 0,
      rotateMid: -14,
      rotateEnd: -28,
      easing: "cubic-bezier(0.24, 0, 0.18, 1)",
      exitScale: 0.6,
      fadeTo: 0.15,
    },
    removeCommitted: {
      duration: 400,
      dip: 14,
      side: 16,
      overshootX: -7,
      overshootY: 5,
      rotateStart: 0,
      rotateMid: -18,
      rotateEnd: -30,
      easing: "cubic-bezier(0.14, 0.82, 0.18, 1)",
      exitScale: 0.48,
      fadeTo: 0.11,
    },
    counter: {
      duration: 390,
      scale: 1.14,
      recoil: 0.95,
      rotate: 3,
      shiftY: 6,
      shiftX: 3,
    },
  },
  {
    id: "magnetic-well",
    name: "Колодец",
    badge: "9 / магнит",
    description: "Верхняя очередь чуть стягивается к центру, а потом каждый эмодзи проваливается в цифру как в воронку.",
    vibe: "Наиболее вау и технологично.",
    accent: "#37cfff",
    accentStrong: "#b2f0ff",
    accentSoft: "rgba(55, 207, 255, 0.16)",
    glow: "rgba(55, 207, 255, 0.28)",
    bgStart: "rgba(3, 15, 22, 0.96)",
    bgEnd: "rgba(4, 7, 10, 0.98)",
    holdPattern: "orbit",
    floatPreset: "orbit",
    initialTotal: 16,
    spawnGap: 74,
    drainGap: 90,
    launch: {
      duration: 820,
      lift: 112,
      side: 34,
      overshootX: 12,
      overshootY: -8,
      rotateStart: -20,
      rotateMid: 10,
      rotateEnd: 4,
      easing: "cubic-bezier(0.18, 1, 0.22, 1)",
      introScale: 0.5,
      midScale: 1.16,
      settleScale: 0.92,
    },
    drop: {
      duration: 640,
      preLift: 12,
      lift: 52,
      side: 20,
      kickX: 2,
      overshootX: 7,
      overshootY: -6,
      rotateKick: 6,
      rotateMid: 10,
      rotateEnd: -10,
      easing: "cubic-bezier(0.08, 0.92, 0.16, 1)",
      impactScale: 1.08,
    },
    removePending: {
      duration: 440,
      dip: 26,
      side: 20,
      overshootX: -10,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -14,
      rotateEnd: -28,
      easing: "cubic-bezier(0.24, 0, 0.24, 1)",
      exitScale: 0.62,
      fadeTo: 0.18,
    },
    removeCommitted: {
      duration: 450,
      dip: 18,
      side: 20,
      overshootX: -8,
      overshootY: 5,
      rotateStart: 0,
      rotateMid: -20,
      rotateEnd: -34,
      easing: "cubic-bezier(0.16, 0.84, 0.2, 1)",
      exitScale: 0.5,
      fadeTo: 0.12,
    },
    counter: {
      duration: 430,
      scale: 1.12,
      recoil: 0.96,
      rotate: 2,
      shiftY: 5,
      shiftX: 2,
    },
  },
  {
    id: "club-jitter",
    name: "Клуб",
    badge: "10 / хлёсткий bounce",
    description: "Самый дерзкий вариант: очередь живее вибрирует, а цифра трясётся чуть сильнее и ощущается почти как игровой combo hit.",
    vibe: "Максимум аркадности.",
    accent: "#ffe067",
    accentStrong: "#fff6be",
    accentSoft: "rgba(255, 224, 103, 0.17)",
    glow: "rgba(255, 224, 103, 0.3)",
    bgStart: "rgba(23, 18, 4, 0.96)",
    bgEnd: "rgba(8, 7, 5, 0.98)",
    holdPattern: "fan",
    floatPreset: "flutter",
    initialTotal: 28,
    spawnGap: 64,
    drainGap: 80,
    launch: {
      duration: 720,
      lift: 122,
      side: 44,
      overshootX: 18,
      overshootY: -12,
      rotateStart: -34,
      rotateMid: 24,
      rotateEnd: 10,
      easing: "cubic-bezier(0.08, 1, 0.2, 1)",
      introScale: 0.44,
      midScale: 1.24,
      settleScale: 0.86,
    },
    drop: {
      duration: 560,
      preLift: 18,
      lift: 40,
      side: 26,
      kickX: 8,
      overshootX: 9,
      overshootY: -2,
      rotateKick: 18,
      rotateMid: 20,
      rotateEnd: -18,
      easing: "cubic-bezier(0.04, 0.94, 0.12, 1)",
      impactScale: 1.26,
    },
    removePending: {
      duration: 410,
      dip: 22,
      side: 20,
      overshootX: -12,
      overshootY: 6,
      rotateStart: 0,
      rotateMid: -20,
      rotateEnd: -38,
      easing: "cubic-bezier(0.24, 0, 0.18, 1)",
      exitScale: 0.58,
      fadeTo: 0.16,
    },
    removeCommitted: {
      duration: 420,
      dip: 18,
      side: 22,
      overshootX: -8,
      overshootY: 5,
      rotateStart: 0,
      rotateMid: -24,
      rotateEnd: -40,
      easing: "cubic-bezier(0.14, 0.84, 0.18, 1)",
      exitScale: 0.48,
      fadeTo: 0.11,
    },
    counter: {
      duration: 420,
      scale: 1.22,
      recoil: 0.9,
      rotate: 7,
      shiftY: 9,
      shiftX: 7,
    },
  },
];

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
          rotate: (tuning.rotateStart * 0.45) * direction,
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

function getHoldPoint(pattern: HoldPattern, index: number, total: number, metrics: SceneMetrics): Point {
  const safeTotal = Math.max(total, 1);
  const t = safeTotal === 1 ? 0.5 : index / Math.max(safeTotal - 1, 1);
  const centerX = metrics.width / 2 - TOKEN_SIZE / 2;
  const top = 56;
  const spread = Math.min(metrics.width * 0.28, 112);

  let x = centerX;
  let y = top;

  switch (pattern) {
    case "crown":
      x = centerX + (t - 0.5) * spread * 1.35;
      y = top + Math.abs(t - 0.5) * 22;
      break;
    case "orbit": {
      const angle = -Math.PI * 0.9 + t * Math.PI * 0.9;
      x = centerX + Math.cos(angle) * spread * 0.78;
      y = top + 22 + Math.sin(angle) * 24;
      break;
    }
    case "wave":
      x = centerX + (t - 0.5) * spread * 1.2;
      y = top + 18 + Math.sin(t * Math.PI * 2) * 14;
      break;
    case "fan":
      x = centerX + (t - 0.5) * spread * 1.48;
      y = top + 8 + Math.abs(t - 0.5) * 28;
      break;
    case "zigzag":
      x = centerX + (t - 0.5) * spread * 1.3;
      y = top + 10 + (index % 2 === 0 ? 4 : 22);
      break;
    case "stack":
      x = centerX + (index % 2 === 0 ? -10 : 10);
      y = top + index * 10;
      break;
  }

  return {
    x: clamp(x, 14, metrics.width - TOKEN_SIZE - 14),
    y: clamp(y, 44, 132),
  };
}

function AnimatedToken({
  token,
  variant,
  metrics,
  onMotionComplete,
}: {
  token: TokenModel;
  variant: VariantConfig;
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
      recipe = buildLaunchMotion(params, variant.launch);
    }

    if (token.phase === "drop") {
      recipe = buildDropMotion(params, variant.drop);
    }

    if (token.phase === "removePending") {
      recipe = buildReturnMotion(params, variant.removePending);
    }

    if (token.phase === "removeCommitted") {
      recipe = buildReturnMotion(params, variant.removeCommitted);
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
  }, [
    metrics,
    onMotionComplete,
    token.from,
    token.id,
    token.motionIndex,
    token.motionKey,
    token.motionTotal,
    token.phase,
    token.to,
    variant,
  ]);

  return (
    <span
      ref={shellRef}
      className={styles.tokenShell}
      style={{
        transform: transformOf({ x: token.x, y: token.y }),
        zIndex: token.phase === "drop" ? 12 : 5 + token.zOrder,
      }}
    >
      <span
        className={cn(
          styles.tokenBody,
          token.phase === "hold" && styles.tokenHold,
          token.phase === "hold" && FLOAT_CLASS[variant.floatPreset]
        )}
      >
        {DEMO_EMOJI}
      </span>
    </span>
  );
}

function VariantCard({ variant }: { variant: VariantConfig }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const centerEmojiRef = useRef<HTMLDivElement | null>(null);
  const minusRef = useRef<HTMLButtonElement | null>(null);
  const plusOneRef = useRef<HTMLButtonElement | null>(null);
  const plusThreeRef = useRef<HTMLButtonElement | null>(null);
  const plusFiveRef = useRef<HTMLButtonElement | null>(null);

  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [committedTotal, setCommittedTotal] = useState(variant.initialTotal);
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

  const clearQueuedTimeouts = useCallback(() => {
    for (const timeoutId of timeoutIdsRef.current) {
      window.clearTimeout(timeoutId);
    }
    timeoutIdsRef.current = [];
  }, []);

  const schedule = useCallback(
    (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        timeoutIdsRef.current = timeoutIdsRef.current.filter((value) => value !== timeoutId);
        callback();
      }, delay);

      timeoutIdsRef.current.push(timeoutId);
      return timeoutId;
    },
    []
  );

  const measureScene = useCallback(() => {
    if (!sceneRef.current || !counterRef.current || !minusRef.current || !plusOneRef.current || !plusThreeRef.current || !plusFiveRef.current) {
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

    anchorsRef.current = {
      metrics: {
        width: sceneRect.width,
        height: sceneRect.height,
      },
      minus: toPoint(minusRef.current),
      plus1: toPoint(plusOneRef.current),
      plus3: toPoint(plusThreeRef.current),
      plus5: toPoint(plusFiveRef.current),
      counter: toPoint(counterRef.current),
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

        const nextPoint = getHoldPoint(variant.holdPattern, nextIndex, pendingIds.length, anchors.metrics);
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
  }, [layoutTick, pendingIds, variant.holdPattern]);

  const pulseCounter = useCallback((direction: CounterDirection) => {
    setCounterDirection(direction);
    setCounterPulseTick((current) => current + 1);
  }, []);

  useEffect(() => {
    if (counterPulseTick === 0 || !counterRef.current) {
      return;
    }

    const motion = buildCounterMotion(counterDirection, variant.counter);
    const animation = counterRef.current.animate(motion.keyframes, {
      duration: motion.duration,
      easing: motion.easing,
      fill: "both",
    });

    return () => {
      animation.cancel();
    };
  }, [counterDirection, counterPulseTick, variant.counter]);

  useEffect(() => {
    if (counterPulseTick === 0 || !centerEmojiRef.current) {
      return;
    }

    const animation = centerEmojiRef.current.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(1) rotate(-2deg)" },
        { offset: 0.28, transform: "translate3d(0, -8px, 0) scale(1.06) rotate(2deg)" },
        { offset: 0.62, transform: "translate3d(0, 4px, 0) scale(0.98) rotate(-1deg)" },
        { transform: "translate3d(0, 0, 0) scale(1) rotate(-2deg)" },
      ],
      {
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );

    return () => {
      animation.cancel();
    };
  }, [counterPulseTick]);

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

    const staggerMs = clamp(Math.round(1200 / commitIds.length), 40, variant.drainGap);

    commitIds.forEach((tokenId, index) => {
      schedule(() => {
        setTokens((current) =>
          current.map((token) => {
            if (token.id !== tokenId) {
              return token;
            }

            return {
              ...token,
              phase: "drop",
              from: { x: token.x, y: token.y },
              to: anchors.counter,
              motionKey: token.motionKey + 1,
              motionIndex: index,
              motionTotal: commitIds.length,
            };
          })
        );
      }, index * staggerMs);
    });
  }, [schedule, variant.drainGap]);

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
    return `${variant.id}-${sequenceRef.current}`;
  }, [variant.id]);

  const spawnToken = useCallback(
    (source: SourceKey) => {
      const anchors = anchorsRef.current;
      if (!anchors) {
        return;
      }

      const id = makeTokenId();
      const pendingCount = pendingIdsRef.current.length;
      const nextTotal = pendingCount + 1;
      const holdPoint = getHoldPoint(variant.holdPattern, pendingCount, nextTotal, anchors.metrics);
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
    [makeTokenId, resetTimer, variant.holdPattern]
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
        const delay = index * variant.spawnGap;
        schedule(() => {
          spawnToken(source);
        }, delay);
      }

      if (centerEmojiRef.current) {
        centerEmojiRef.current.animate(
          [
            { transform: "translate3d(0, 0, 0) scale(1) rotate(-2deg)" },
            { offset: 0.28, transform: "translate3d(0, -10px, 0) scale(1.08) rotate(3deg)" },
            { offset: 0.66, transform: "translate3d(0, 4px, 0) scale(0.96) rotate(-1deg)" },
            { transform: "translate3d(0, 0, 0) scale(1) rotate(-2deg)" },
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      }
    },
    [isCommitting, isReady, schedule, spawnToken, variant.spawnGap]
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
    setTokens((current) => [
      ...current,
      {
        id,
        phase: "removeCommitted",
        x: anchors.counter.x,
        y: anchors.counter.y,
        from: anchors.counter,
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
        const metrics = anchorsRef.current?.metrics;
        const nextIndex = pendingIdsRef.current.indexOf(id);
        setTokens((current) =>
          current.map((token) => {
            if (token.id !== id) {
              return token;
            }

            const holdPoint =
              metrics && nextIndex !== -1
                ? getHoldPoint(variant.holdPattern, nextIndex, pendingIdsRef.current.length, metrics)
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
        setCommittedTotal((current) => current + 1);
        pulseCounter("up");
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
    [finishCommit, pulseCounter, variant.holdPattern]
  );

  const resetDemo = useCallback(() => {
    clearQueuedTimeouts();
    sequenceRef.current = 0;
    timerDeadlineRef.current = null;
    commitLockRef.current = false;
    commitRemainingRef.current = 0;
    pendingIdsRef.current = [];
    setTokens([]);
    setPendingIds([]);
    setCommittedTotal(variant.initialTotal);
    setTimeLeftMs(0);
    setIsCommitting(false);
  }, [clearQueuedTimeouts, variant.initialTotal]);

  const progressPercent = isCommitting ? 100 : pendingIds.length === 0 ? 0 : (timeLeftMs / BUFFER_MS) * 100;
  const statusLabel = useMemo(() => {
    if (!isReady) {
      return "Калибрую траектории";
    }

    if (isCommitting) {
      return "Эмодзи сыпятся в общий счёт";
    }

    if (pendingIds.length > 0) {
      return `Буфер активен ${Math.ceil(timeLeftMs / 1000)}с`;
    }

    return "Нажми +1, +3 или +5";
  }, [isCommitting, isReady, pendingIds.length, timeLeftMs]);

  const sceneStyle = useMemo(
    () =>
      ({
        "--lab-accent": variant.accent,
        "--lab-accent-strong": variant.accentStrong,
        "--lab-accent-soft": variant.accentSoft,
        "--lab-glow": variant.glow,
        "--lab-bg-start": variant.bgStart,
        "--lab-bg-end": variant.bgEnd,
      }) as CSSProperties,
    [variant.accent, variant.accentSoft, variant.accentStrong, variant.bgEnd, variant.bgStart, variant.glow]
  );

  const buttonStyle = useMemo(
    () =>
      ({
        background: `linear-gradient(135deg, ${variant.accentStrong}, ${variant.accent})`,
      }) as CSSProperties,
    [variant.accent, variant.accentStrong]
  );

  return (
    <Card
      className={cn(styles.variantCard, "shadow-[0_28px_80px_-52px_rgba(0,0,0,0.9)]")}
      data-variant-id={variant.id}
    >
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge className="border-zinc-800 bg-zinc-950 text-zinc-300">{variant.badge}</Badge>
            <div>
              <CardTitle className="text-xl text-zinc-50">{variant.name}</CardTitle>
              <CardDescription className="mt-2 max-w-xl text-zinc-400">{variant.description}</CardDescription>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="rounded-full" onClick={resetDemo}>
            Сброс
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div ref={sceneRef} className={styles.scene} style={sceneStyle}>
          <div className={styles.progressTrack}>
            <div
              className={cn(styles.progressFill, isCommitting && styles.progressCommitting)}
              style={{ width: `${clamp(progressPercent, 0, 100)}%` }}
            />
          </div>

          <div className={styles.hud}>
            <div className={styles.statusCluster}>
              <div className={styles.statusBadge}>
                <span className={styles.statusDot} />
                <span>Буфер {pendingIds.length}</span>
                {pendingIds.length > 0 && !isCommitting ? <span>{(timeLeftMs / 1000).toFixed(1)}с</span> : null}
              </div>
              <div className={styles.statusText}>{statusLabel}</div>
            </div>

            <div ref={counterRef} className={styles.counter}>
              <div className={styles.counterLabel}>Общая цифра</div>
              <div className={styles.counterValue}>{committedTotal}</div>
            </div>
          </div>

          <div className={styles.holdZone} />

          <div className={styles.centerpiece}>
            <div className={styles.centerAura} />
            <div ref={centerEmojiRef} className={styles.centerEmojiWrap}>
              <div className={styles.centerEmoji}>{DEMO_EMOJI}</div>
            </div>
            <div className={styles.centerCaption}>
              Большой эмодзи в центре как будущий аватар упражнения. Сейчас это демо с какашкой.
            </div>
          </div>

          {tokens.map((token) => (
            <AnimatedToken
              key={token.id}
              token={token}
              variant={variant}
              metrics={anchorsRef.current?.metrics ?? { width: 320, height: 420 }}
              onMotionComplete={handleMotionComplete}
            />
          ))}

          <div className={styles.buttonDock}>
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
              ref={plusOneRef}
              className={cn(styles.controlButton, styles.plusButton)}
              style={buttonStyle}
              onClick={() => handleAdd(1, "plus1")}
              disabled={!isReady || isCommitting || pendingIds.length >= MAX_PENDING}
            >
              +1
            </Button>
            <Button
              ref={plusThreeRef}
              className={cn(styles.controlButton, styles.plusButton)}
              style={buttonStyle}
              onClick={() => handleAdd(3, "plus3")}
              disabled={!isReady || isCommitting || pendingIds.length >= MAX_PENDING}
            >
              +3
            </Button>
            <Button
              ref={plusFiveRef}
              className={cn(styles.controlButton, styles.plusButton)}
              style={buttonStyle}
              onClick={() => handleAdd(5, "plus5")}
              disabled={!isReady || isCommitting || pendingIds.length >= MAX_PENDING}
            >
              +5
            </Button>
          </div>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.metaPill}>
            <div className={styles.metaLabel}>Характер</div>
            <div className={styles.metaValue}>{variant.vibe}</div>
          </div>
          <div className={styles.metaPill}>
            <div className={styles.metaLabel}>Минус</div>
            <div className={styles.metaValue}>Если буфер не пуст, сдёргивает последний эмодзи сверху. Если пуст, вычитает уже зафиксированный.</div>
          </div>
          <div className={styles.metaPill}>
            <div className={styles.metaLabel}>Сценарий</div>
            <div className={styles.metaValue}>Эмодзи взлетают от кнопки, висят до конца таймера и затем падают в общий счёт по одному.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SetAnimationLab() {
  return (
    <div className="space-y-6 pb-8">
      <Card className={styles.heroCard}>
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge className="border-zinc-800 bg-zinc-950 text-zinc-300">10 интерактивных вариантов</Badge>
              <div className="max-w-3xl">
                <CardTitle className="text-2xl text-zinc-50 sm:text-3xl">
                  Лаборатория геймифицированного добавления подходов
                </CardTitle>
                <CardDescription className="mt-3 text-base leading-7 text-zinc-300">
                  Здесь каждый вариант повторяет твою идею: эмодзи подлетают от кнопок вверх, висят под таймером,
                  а потом быстро падают в общую цифру по одному. Цифра на каждый влет трясётся и растёт. Для демо
                  используется большая центральная какашка, но сам сценарий уже готов под будущий выбор эмодзи для
                  упражнений.
                </CardDescription>
              </div>
            </div>

            <div className="grid min-w-60 gap-2 sm:min-w-72">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Как читать демо</div>
                <div className="mt-2 text-sm leading-6 text-zinc-300">
                  `+` добавляет эмодзи в буфер. `-1` снимает последний сверху или вычитает уже засчитанный. Таймер
                  одинаковый, а вся разница только в характере движения и реакции счётчика.
                </div>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-black/70 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">На что смотреть</div>
                <div className="mt-2 text-sm leading-6 text-zinc-300">
                  Насколько приятно висят эмодзи наверху, как читается падение по одному, и не кажется ли удар в
                  цифру слишком жёстким или, наоборот, слишком вялым.
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {VARIANTS.map((variant) => (
          <VariantCard key={variant.id} variant={variant} />
        ))}
      </div>
    </div>
  );
}
