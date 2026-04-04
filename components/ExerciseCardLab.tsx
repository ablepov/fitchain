"use client";

import { type CSSProperties, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./ExerciseCardLab.module.css";

const DEMO_TOKEN = "●";
const BUFFER_MS = 4200;
const TICK_MS = 50;
const TOKEN_SIZE = 30;
const MAX_PENDING = 18;
const DROP_IMPACT_PROGRESS = 0.78;

type MotionPhase = "launch" | "hold" | "drop" | "removePending" | "removeCommitted";
type CounterDirection = "up" | "down";
type HoldPattern = "crown" | "orbit" | "wave" | "fan" | "zigzag" | "stack";
type FloatPreset = "drift" | "hover" | "orbit" | "bob" | "flutter";
type GoalMode = "goalBarMode" | "goalRingMode" | "goalStackMode";
type MetricMode = "metricTilesMode" | "metricStripMode" | "metricCapsuleMode";
type LayoutMode =
  | "apexLayout"
  | "railLayout"
  | "coachLayout"
  | "splitLayout"
  | "orbitLayout"
  | "posterLayout"
  | "blueprintLayout"
  | "capsuleLayout"
  | "boardLayout"
  | "studioLayout";

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
  plus1: Point;
  plus3: Point;
  plus5: Point;
  counter: Point;
};

type SourceKey = "plus1" | "plus3" | "plus5";

type ExerciseConcept = {
  id: string;
  badge: string;
  name: string;
  exercise: string;
  cluster: string;
  tagline: string;
  goalTitle: string;
  current: number;
  target: number;
  note: string;
  summary: string;
  chart: number[];
  metrics: Array<{ label: string; value: string }>;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  glow: string;
  surfaceStart: string;
  surfaceEnd: string;
  sceneStart: string;
  sceneEnd: string;
  layout: LayoutMode;
  goalMode: GoalMode;
  metricMode: MetricMode;
};

const FLOAT_CLASS: Record<FloatPreset, string> = {
  drift: styles.floatDrift,
  hover: styles.floatHover,
  orbit: styles.floatOrbit,
  bob: styles.floatBob,
  flutter: styles.floatFlutter,
};

const MOTION_CONFIG: MotionConfig = {
  holdPattern: "stack",
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

const EXERCISE_CARD_CONCEPTS: ExerciseConcept[] = [
  {
    id: "signal-glow",
    badge: "01 / signal glow",
    name: "Signal Glow",
    exercise: "Air Squat",
    cluster: "Ноги · мобильность · без веса",
    tagline: "Hero-карточка с акцентом на счётчик, плавным кольцом цели и максимально чистой иерархией.",
    goalTitle: "Цель разминки",
    current: 38,
    target: 60,
    note: "Хороша, если нужна одна доминирующая цифра и минимум шума вокруг CTA.",
    summary: "Тестировать, не становится ли слишком плакатной при длинных названиях упражнений.",
    chart: [12, 14, 16, 15, 18, 20, 22],
    metrics: [
      { label: "Сеты", value: "4 x 15" },
      { label: "Отдых", value: "45с" },
      { label: "Фокус", value: "Колени" },
    ],
    accent: "#63d5ff",
    accentStrong: "#dcf7ff",
    accentSoft: "rgba(99, 213, 255, 0.18)",
    glow: "rgba(99, 213, 255, 0.35)",
    surfaceStart: "rgba(7, 22, 34, 0.98)",
    surfaceEnd: "rgba(2, 6, 10, 0.98)",
    sceneStart: "rgba(6, 20, 31, 0.98)",
    sceneEnd: "rgba(3, 9, 16, 0.98)",
    layout: "apexLayout",
    goalMode: "goalRingMode",
    metricMode: "metricTilesMode",
  },
  {
    id: "momentum-rail",
    badge: "02 / momentum rail",
    name: "Momentum Rail",
    exercise: "Push-up",
    cluster: "Грудь · база · темп",
    tagline: "Плотный rail-layout, где прогресс идёт сразу под заголовком, а сцена работает как живая полоса действия.",
    goalTitle: "Цель блока",
    current: 24,
    target: 40,
    note: "Быстро читается на бегу и подходит, если на первом экране нужен ритм, а не вау.",
    summary: "Проверить, не выглядит ли слишком утилитарно рядом с более эмоциональными карточками.",
    chart: [6, 8, 8, 10, 9, 11, 12],
    metrics: [
      { label: "Сеты", value: "5 x 8" },
      { label: "Отдых", value: "60с" },
      { label: "Фокус", value: "Пауза" },
    ],
    accent: "#7cff8c",
    accentStrong: "#e5ffe8",
    accentSoft: "rgba(124, 255, 140, 0.18)",
    glow: "rgba(124, 255, 140, 0.32)",
    surfaceStart: "rgba(10, 29, 14, 0.98)",
    surfaceEnd: "rgba(4, 8, 5, 0.98)",
    sceneStart: "rgba(10, 25, 12, 0.98)",
    sceneEnd: "rgba(5, 9, 6, 0.98)",
    layout: "railLayout",
    goalMode: "goalBarMode",
    metricMode: "metricStripMode",
  },
  {
    id: "coach-note",
    badge: "03 / coach note",
    name: "Coach Note",
    exercise: "Romanian Deadlift",
    cluster: "Задняя цепь · техника · контроль",
    tagline: "Карточка с чуть более человечным характером: заметка тренера включена прямо в композицию.",
    goalTitle: "Цель техники",
    current: 42,
    target: 54,
    note: "Подходит под более персональный сценарий, где карточка должна не только считать, но и вести.",
    summary: "Важно проверить, не расползается ли высота, если подсказка тренера станет длиннее.",
    chart: [10, 10, 12, 12, 14, 14, 15],
    metrics: [
      { label: "Сеты", value: "3 x 12" },
      { label: "Отдых", value: "75с" },
      { label: "Фокус", value: "Спина" },
    ],
    accent: "#ffb36b",
    accentStrong: "#ffe8d1",
    accentSoft: "rgba(255, 179, 107, 0.18)",
    glow: "rgba(255, 179, 107, 0.34)",
    surfaceStart: "rgba(35, 17, 6, 0.98)",
    surfaceEnd: "rgba(10, 7, 4, 0.98)",
    sceneStart: "rgba(28, 14, 5, 0.98)",
    sceneEnd: "rgba(10, 7, 5, 0.98)",
    layout: "coachLayout",
    goalMode: "goalStackMode",
    metricMode: "metricCapsuleMode",
  },
  {
    id: "split-dash",
    badge: "04 / split dash",
    name: "Split Dash",
    exercise: "Walking Lunge",
    cluster: "Ноги · выносливость · шаг",
    tagline: "Более редакционный split-screen: слева продуктовая информация, справа живая сцена.",
    goalTitle: "Цель по шагам",
    current: 30,
    target: 48,
    note: "Сильнее ощущается как карточка упражнения из живого мобильного приложения, а не demo-слайд.",
    summary: "Тестировать на длинных сериях и на том, насколько правая сцена не перевешивает левую инфо-колонку.",
    chart: [8, 10, 10, 12, 12, 14, 16],
    metrics: [
      { label: "Сеты", value: "4 x 12" },
      { label: "Отдых", value: "50с" },
      { label: "Фокус", value: "Баланс" },
    ],
    accent: "#d37cff",
    accentStrong: "#f3deff",
    accentSoft: "rgba(211, 124, 255, 0.18)",
    glow: "rgba(211, 124, 255, 0.34)",
    surfaceStart: "rgba(24, 10, 34, 0.98)",
    surfaceEnd: "rgba(7, 4, 11, 0.98)",
    sceneStart: "rgba(22, 9, 31, 0.98)",
    sceneEnd: "rgba(8, 5, 13, 0.98)",
    layout: "splitLayout",
    goalMode: "goalBarMode",
    metricMode: "metricTilesMode",
  },
  {
    id: "orbit-glass",
    badge: "05 / orbit glass",
    name: "Orbit Glass",
    exercise: "Lat Pulldown",
    cluster: "Спина · ширина · тяга",
    tagline: "Стеклянный, чуть более премиальный слой, где прогресс выглядит как отдельный прибор.",
    goalTitle: "Цель тяги",
    current: 36,
    target: 50,
    note: "Хороший кандидат, если хочется ощущения девайса и аккуратного hi-fi интерфейса.",
    summary: "Посмотреть, не теряется ли читаемость на ярких градиентах в реальном каталоге упражнений.",
    chart: [9, 10, 11, 11, 12, 13, 14],
    metrics: [
      { label: "Сеты", value: "4 x 10" },
      { label: "Отдых", value: "70с" },
      { label: "Фокус", value: "Лопатки" },
    ],
    accent: "#46f0d2",
    accentStrong: "#ddfff8",
    accentSoft: "rgba(70, 240, 210, 0.18)",
    glow: "rgba(70, 240, 210, 0.32)",
    surfaceStart: "rgba(6, 26, 23, 0.98)",
    surfaceEnd: "rgba(3, 10, 9, 0.98)",
    sceneStart: "rgba(7, 24, 23, 0.98)",
    sceneEnd: "rgba(4, 11, 11, 0.98)",
    layout: "orbitLayout",
    goalMode: "goalRingMode",
    metricMode: "metricCapsuleMode",
  },
  {
    id: "poster-energy",
    badge: "06 / poster energy",
    name: "Poster Energy",
    exercise: "Box Step-up",
    cluster: "Ноги · пульс · динамика",
    tagline: "Почти афиша: крупный блок действия, жирный низ и контрастная подача движения.",
    goalTitle: "Цель интервала",
    current: 18,
    target: 32,
    note: "Сильный вариант, если карточка должна продавать движение, а не только считать объём.",
    summary: "Проверить, не слишком ли громкий тон для спокойных силовых упражнений.",
    chart: [4, 5, 6, 6, 7, 8, 9],
    metrics: [
      { label: "Сеты", value: "4 x 8" },
      { label: "Отдых", value: "40с" },
      { label: "Фокус", value: "Пульс" },
    ],
    accent: "#ff6d8f",
    accentStrong: "#ffdce6",
    accentSoft: "rgba(255, 109, 143, 0.18)",
    glow: "rgba(255, 109, 143, 0.34)",
    surfaceStart: "rgba(35, 8, 16, 0.98)",
    surfaceEnd: "rgba(11, 4, 6, 0.98)",
    sceneStart: "rgba(32, 8, 16, 0.98)",
    sceneEnd: "rgba(11, 5, 7, 0.98)",
    layout: "posterLayout",
    goalMode: "goalStackMode",
    metricMode: "metricStripMode",
  },
  {
    id: "data-grid",
    badge: "07 / data grid",
    name: "Data Grid",
    exercise: "Bench Press",
    cluster: "Грудь · сила · штанга",
    tagline: "Технический blueprint-подход с сеткой и более инженерным настроением интерфейса.",
    goalTitle: "Цель объёма",
    current: 28,
    target: 40,
    note: "Хорошо работает, если рядом будет больше аналитики и нужен мост между карточкой и статистикой.",
    summary: "Нужно проверить, не становится ли визуально слишком холодной и взрослой для ежедневной тренировки.",
    chart: [6, 6, 7, 8, 8, 9, 10],
    metrics: [
      { label: "Сеты", value: "5 x 6" },
      { label: "Отдых", value: "90с" },
      { label: "Фокус", value: "Мост" },
    ],
    accent: "#7bb8ff",
    accentStrong: "#deebff",
    accentSoft: "rgba(123, 184, 255, 0.18)",
    glow: "rgba(123, 184, 255, 0.34)",
    surfaceStart: "rgba(10, 18, 34, 0.98)",
    surfaceEnd: "rgba(4, 7, 12, 0.98)",
    sceneStart: "rgba(8, 16, 31, 0.98)",
    sceneEnd: "rgba(4, 8, 13, 0.98)",
    layout: "blueprintLayout",
    goalMode: "goalBarMode",
    metricMode: "metricTilesMode",
  },
  {
    id: "capsule-stack",
    badge: "08 / capsule stack",
    name: "Capsule Stack",
    exercise: "Kettlebell Swing",
    cluster: "Кор · мощность · темп",
    tagline: "Закруглённый, почти носимый интерфейс с capsule-блоками и мягкой глубиной.",
    goalTitle: "Цель мощности",
    current: 52,
    target: 70,
    note: "Подходит для сценария с очень дружелюбным тоном и менее агрессивной фитнес-подачей.",
    summary: "Посмотреть, не начинает ли карточка выглядеть слишком wellness и мало спортивно.",
    chart: [10, 12, 12, 14, 14, 16, 18],
    metrics: [
      { label: "Сеты", value: "5 x 14" },
      { label: "Отдых", value: "35с" },
      { label: "Фокус", value: "Хип-хиндж" },
    ],
    accent: "#ffd86a",
    accentStrong: "#fff5d2",
    accentSoft: "rgba(255, 216, 106, 0.18)",
    glow: "rgba(255, 216, 106, 0.34)",
    surfaceStart: "rgba(36, 24, 7, 0.98)",
    surfaceEnd: "rgba(11, 8, 4, 0.98)",
    sceneStart: "rgba(31, 22, 7, 0.98)",
    sceneEnd: "rgba(10, 8, 5, 0.98)",
    layout: "capsuleLayout",
    goalMode: "goalRingMode",
    metricMode: "metricCapsuleMode",
  },
  {
    id: "focus-board",
    badge: "09 / focus board",
    name: "Focus Board",
    exercise: "Plank Reach",
    cluster: "Кор · стабилизация · контроль",
    tagline: "Чуть более board-like карта, где прогресс и note-секция читаются как рабочая доска сессии.",
    goalTitle: "Цель стабилизации",
    current: 20,
    target: 30,
    note: "Удачный средний путь между эмоциональной карточкой и структурной сессией со статусами.",
    summary: "Важно понять, не становится ли сцена слишком вторичной из-за сильного блока заметки сверху.",
    chart: [3, 4, 4, 5, 5, 6, 6],
    metrics: [
      { label: "Сеты", value: "3 x 10" },
      { label: "Отдых", value: "30с" },
      { label: "Фокус", value: "Таз" },
    ],
    accent: "#8dffcf",
    accentStrong: "#e6fff5",
    accentSoft: "rgba(141, 255, 207, 0.18)",
    glow: "rgba(141, 255, 207, 0.32)",
    surfaceStart: "rgba(7, 28, 22, 0.98)",
    surfaceEnd: "rgba(4, 9, 8, 0.98)",
    sceneStart: "rgba(7, 24, 19, 0.98)",
    sceneEnd: "rgba(4, 10, 8, 0.98)",
    layout: "boardLayout",
    goalMode: "goalBarMode",
    metricMode: "metricStripMode",
  },
  {
    id: "studio-rail",
    badge: "10 / studio rail",
    name: "Studio Rail",
    exercise: "Seated Row",
    cluster: "Спина · объём · контроль",
    tagline: "Спокойная студийная карточка: меньше шоу, больше ощущения дорогого тренажёрного интерфейса.",
    goalTitle: "Цель блока спины",
    current: 34,
    target: 46,
    note: "Хороший кандидат на основной продуктовый стиль, если хочется устойчивой базы без излишней аркадности.",
    summary: "Проверить, хватит ли ей характера рядом с более смелыми концептами и градиентными hero-вариантами.",
    chart: [8, 8, 9, 10, 10, 11, 12],
    metrics: [
      { label: "Сеты", value: "4 x 10" },
      { label: "Отдых", value: "65с" },
      { label: "Фокус", value: "Пауза" },
    ],
    accent: "#8ea2ff",
    accentStrong: "#e3e8ff",
    accentSoft: "rgba(142, 162, 255, 0.18)",
    glow: "rgba(142, 162, 255, 0.34)",
    surfaceStart: "rgba(10, 15, 32, 0.98)",
    surfaceEnd: "rgba(5, 7, 13, 0.98)",
    sceneStart: "rgba(10, 15, 29, 0.98)",
    sceneEnd: "rgba(5, 8, 14, 0.98)",
    layout: "studioLayout",
    goalMode: "goalStackMode",
    metricMode: "metricTilesMode",
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

function getHoldPoint(pattern: HoldPattern, index: number, total: number, metrics: SceneMetrics): Point {
  const safeTotal = Math.max(total, 1);
  const t = safeTotal === 1 ? 0.5 : index / Math.max(safeTotal - 1, 1);
  const centerX = metrics.width / 2 - TOKEN_SIZE / 2;
  const top = 52;
  const spread = Math.min(metrics.width * 0.28, 108);

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
      x = centerX + (index % 2 === 0 ? -9 : 9);
      y = top + index * 9;
      break;
  }

  return {
    x: clamp(x, 14, metrics.width - TOKEN_SIZE - 14),
    y: clamp(y, 40, 132),
  };
}

function BackgroundChart({ values }: { values: number[] }) {
  const gradientId = useId();
  const width = 240;
  const height = 132;
  const pad = 12;
  const max = Math.max(...values, 1);
  const innerHeight = height - pad * 2;
  const points = values.map((value, index) => {
    const x = pad + (index * (width - pad * 2)) / Math.max(values.length - 1, 1);
    const y = pad + innerHeight - (value / max) * innerHeight;

    return { x, y };
  });
  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPoints = `${pad},${height - pad} ${points.map((point) => `${point.x},${point.y}`).join(" ")} ${
    points[points.length - 1]?.x ?? width - pad
  },${height - pad}`;

  return (
    <div className={styles.sceneChart} aria-hidden="true">
      <svg className={styles.sceneChartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} className={styles.sceneChartAxis} />
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <path d={pathData} className={styles.sceneChartPath} />
        {points.map((point, index) => (
          <circle
            key={`${gradientId}-${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? "2.8" : "1.8"}
            className={styles.sceneChartDot}
          />
        ))}
      </svg>
    </div>
  );
}

function GoalPanel({
  concept,
  committedTotal,
  pendingCount,
}: {
  concept: ExerciseConcept;
  committedTotal: number;
  pendingCount: number;
}) {
  const remaining = Math.max(0, concept.target - committedTotal);
  const actualProgress = clamp((committedTotal / concept.target) * 100, 0, 100);
  const projectedProgress = clamp(((committedTotal + pendingCount) / concept.target) * 100, 0, 100);
  const goalStyle = {
    "--goal-progress": `${projectedProgress}%`,
  } as CSSProperties;

  if (concept.goalMode === "goalRingMode") {
    return (
      <div className={styles.goalRingPanel}>
        <div className={styles.goalTextBlock}>
          <div className={styles.sectionLabel}>{concept.goalTitle}</div>
          <div className={styles.goalPrimaryValue}>
            {committedTotal}
            <span>/{concept.target}</span>
          </div>
          <div className={styles.goalSecondaryText}>
            Осталось {remaining} · {pendingCount > 0 ? `+${pendingCount} в буфере` : "буфер пуст"}
          </div>
        </div>
        <div className={styles.goalRing} style={goalStyle}>
          <div className={styles.goalRingInner}>
            <span className={styles.goalRingLabel}>цель</span>
            <span className={styles.goalRingValue}>{Math.round(projectedProgress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  if (concept.goalMode === "goalStackMode") {
    return (
      <div className={styles.goalStackPanel}>
        <div className={styles.sectionLabel}>{concept.goalTitle}</div>
        <div className={styles.goalStackRow}>
          <div className={styles.goalStackValue}>{remaining}</div>
          <div className={styles.goalStackMeta}>
            <span>до цели</span>
            <strong>{committedTotal} уже сделано</strong>
          </div>
        </div>
        <div className={styles.goalTrack}>
          <div className={styles.goalProjectedFill} style={{ width: `${projectedProgress}%` }} />
          <div className={styles.goalActualFill} style={{ width: `${actualProgress}%` }} />
        </div>
        <div className={styles.goalSecondaryText}>{pendingCount > 0 ? `После таймера станет ${committedTotal + pendingCount}` : "Можно добить прямо из этой карточки"}</div>
      </div>
    );
  }

  return (
    <div className={styles.goalBarPanel}>
      <div className={styles.goalBarHeader}>
        <div>
          <div className={styles.sectionLabel}>{concept.goalTitle}</div>
          <div className={styles.goalPrimaryValue}>
            {committedTotal}
            <span>/{concept.target}</span>
          </div>
        </div>
        <div className={styles.goalMiniMeta}>
          <strong>{remaining}</strong>
          <span>до цели</span>
        </div>
      </div>
      <div className={styles.goalTrack}>
        <div className={styles.goalProjectedFill} style={{ width: `${projectedProgress}%` }} />
        <div className={styles.goalActualFill} style={{ width: `${actualProgress}%` }} />
      </div>
      <div className={styles.goalSecondaryText}>{pendingCount > 0 ? `В буфере +${pendingCount}` : "График остаётся вторичным фоном"}</div>
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

function ExerciseConceptCard({ concept }: { concept: ExerciseConcept }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const totalRef = useRef<HTMLDivElement | null>(null);
  const minusRef = useRef<HTMLButtonElement | null>(null);
  const plusOneRef = useRef<HTMLButtonElement | null>(null);
  const plusThreeRef = useRef<HTMLButtonElement | null>(null);
  const plusFiveRef = useRef<HTMLButtonElement | null>(null);

  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [committedTotal, setCommittedTotal] = useState(concept.current);
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
      !totalRef.current ||
      !minusRef.current ||
      !plusOneRef.current ||
      !plusThreeRef.current ||
      !plusFiveRef.current
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

    anchorsRef.current = {
      metrics: {
        width: sceneRect.width,
        height: sceneRect.height,
      },
      minus: toPoint(minusRef.current),
      plus1: toPoint(plusOneRef.current),
      plus3: toPoint(plusThreeRef.current),
      plus5: toPoint(plusFiveRef.current),
      counter: toPoint(totalRef.current),
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

        const nextPoint = getHoldPoint(MOTION_CONFIG.holdPattern, nextIndex, pendingIds.length, anchors.metrics);
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
    if (counterPulseTick === 0 || !totalRef.current) {
      return;
    }

    const motion = buildCounterMotion(counterDirection, MOTION_CONFIG.counter);
    const animation = totalRef.current.animate(motion.keyframes, {
      duration: motion.duration,
      easing: motion.easing,
      fill: "both",
    });

    return () => {
      animation.cancel();
    };
  }, [counterDirection, counterPulseTick]);

  useEffect(() => {
    if (counterPulseTick === 0 || !totalRef.current) {
      return;
    }

    const animation = totalRef.current.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(1)" },
        { offset: 0.28, transform: "translate3d(0, -10px, 0) scale(1.08)" },
        { offset: 0.62, transform: "translate3d(0, 4px, 0) scale(0.98)" },
        { transform: "translate3d(0, 0, 0) scale(1)" },
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

    const staggerMs = clamp(Math.round(1200 / commitIds.length), 40, MOTION_CONFIG.drainGap);
    const impactDelayMs = Math.round(MOTION_CONFIG.drop.duration * DROP_IMPACT_PROGRESS);

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

      schedule(() => {
        setCommittedTotal((current) => current + 1);
        pulseCounter("up");
      }, index * staggerMs + impactDelayMs);
    });
  }, [pulseCounter, schedule]);

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
    return `${concept.id}-${sequenceRef.current}`;
  }, [concept.id]);

  const spawnToken = useCallback(
    (source: SourceKey) => {
      const anchors = anchorsRef.current;
      if (!anchors) {
        return;
      }

      const id = makeTokenId();
      const pendingCount = pendingIdsRef.current.length;
      const nextTotal = pendingCount + 1;
      const holdPoint = getHoldPoint(MOTION_CONFIG.holdPattern, pendingCount, nextTotal, anchors.metrics);
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

      if (totalRef.current) {
        totalRef.current.animate(
          [
            { transform: "translate3d(0, 0, 0) scale(1)" },
            { offset: 0.28, transform: "translate3d(0, -8px, 0) scale(1.04)" },
            { offset: 0.66, transform: "translate3d(0, 4px, 0) scale(0.98)" },
            { transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: 360,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
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
              metrics && nextIndex !== -1 ? getHoldPoint(MOTION_CONFIG.holdPattern, nextIndex, pendingIdsRef.current.length, metrics) : token.to;

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

  const resetDemo = useCallback(() => {
    clearQueuedTimeouts();
    sequenceRef.current = 0;
    timerDeadlineRef.current = null;
    commitLockRef.current = false;
    commitRemainingRef.current = 0;
    pendingIdsRef.current = [];
    setTokens([]);
    setPendingIds([]);
    setCommittedTotal(concept.current);
    setTimeLeftMs(0);
    setIsCommitting(false);
  }, [clearQueuedTimeouts, concept.current]);

  const bufferProgress = isCommitting ? 100 : pendingIds.length === 0 ? 0 : (timeLeftMs / BUFFER_MS) * 100;
  const remainingToGoal = Math.max(0, concept.target - committedTotal);
  const statusLabel = useMemo(() => {
    if (!isReady) {
      return "Калибрую траектории";
    }

    if (isCommitting) {
      return "Пачка улетает в общий счёт";
    }

    if (pendingIds.length > 0) {
      return `Буфер держит стек ещё ${Math.ceil(timeLeftMs / 100) / 10}с`;
    }

    return "Добавь +1, +3 или +5";
  }, [isCommitting, isReady, pendingIds.length, timeLeftMs]);

  const themeStyle = useMemo(
    () =>
      ({
        "--card-accent": concept.accent,
        "--card-accent-strong": concept.accentStrong,
        "--card-accent-soft": concept.accentSoft,
        "--card-glow": concept.glow,
        "--card-surface-start": concept.surfaceStart,
        "--card-surface-end": concept.surfaceEnd,
        "--scene-start": concept.sceneStart,
        "--scene-end": concept.sceneEnd,
      }) as CSSProperties,
    [concept.accent, concept.accentSoft, concept.accentStrong, concept.glow, concept.sceneEnd, concept.sceneStart, concept.surfaceEnd, concept.surfaceStart]
  );

  const buttonStyle = useMemo(
    () =>
      ({
        background: `linear-gradient(135deg, ${concept.accentStrong}, ${concept.accent})`,
      }) as CSSProperties,
    [concept.accent, concept.accentStrong]
  );

  return (
    <article className={cn(styles.exerciseCard, styles[concept.layout])} style={themeStyle} data-card-id={concept.id}>
      <section className={cn(styles.section, styles.leadSection)}>
        <div className={styles.leadTop}>
          <Badge className={styles.cardBadge}>{concept.badge}</Badge>
          <span className={styles.conceptName}>{concept.name}</span>
        </div>
        <div className={styles.exerciseName}>{concept.exercise}</div>
        <div className={styles.exerciseCluster}>{concept.cluster}</div>
        <p className={styles.sectionCopy}>{concept.tagline}</p>
      </section>

      <section className={cn(styles.section, styles.goalSection, styles[concept.goalMode])}>
        <GoalPanel concept={concept} committedTotal={committedTotal} pendingCount={pendingIds.length} />
      </section>

      <section className={cn(styles.section, styles.sceneSection)}>
        <div ref={sceneRef} className={styles.scene}>
          <BackgroundChart values={concept.chart} />

          <div className={styles.bufferTrack}>
            <div
              className={cn(styles.bufferFill, isCommitting && styles.bufferCommitting)}
              style={{ width: `${clamp(bufferProgress, 0, 100)}%` }}
            />
          </div>

          <div className={styles.sceneHud}>
            <div className={styles.sceneStatus}>
              <div className={styles.sceneStatusPill}>
                <span className={styles.sceneStatusDot} />
                <span>Буфер {pendingIds.length}</span>
                {pendingIds.length > 0 && !isCommitting ? <span>{(timeLeftMs / 1000).toFixed(1)}с</span> : null}
              </div>
              <div className={styles.sceneStatusText}>{statusLabel}</div>
            </div>
            <div className={styles.sceneGoalMini}>
              <span>до цели</span>
              <strong>{remainingToGoal}</strong>
            </div>
          </div>

          <div className={styles.holdZone} />

          <div className={styles.centerpiece}>
            <div className={styles.centerAura} />
            <div className={styles.centerKicker}>сделано</div>
            <div ref={totalRef} className={styles.centerTotal}>
              {committedTotal}
            </div>
          </div>

          {tokens.map((token) => (
            <AnimatedToken
              key={token.id}
              token={token}
              metrics={anchorsRef.current?.metrics ?? { width: 320, height: 380 }}
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
      </section>

      <section className={cn(styles.section, styles.metricsSection, styles[concept.metricMode])}>
        <div className={styles.sectionLabel}>Ключевые параметры</div>
        <div className={styles.metricGrid}>
          {concept.metrics.map((metric) => (
            <div key={`${concept.id}-${metric.label}`} className={styles.metricPill}>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricValue}>{metric.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={cn(styles.section, styles.coachSection)}>
        <div className={styles.sectionLabel}>Почему этот стиль может взлететь</div>
        <p className={styles.sectionCopy}>{concept.note}</p>
      </section>

      <section className={cn(styles.section, styles.footerSection)}>
        <div className={styles.footerCopyBlock}>
          <div className={styles.sectionLabel}>Что смотреть дальше</div>
          <p className={styles.sectionCopy}>{concept.summary}</p>
        </div>
        <Button variant="secondary" size="sm" className={styles.resetButton} onClick={resetDemo}>
          Сброс
        </Button>
      </section>
    </article>
  );
}

export function ExerciseCardLab() {
  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <Badge className={styles.heroBadge}>10 концептов exercise card</Badge>
            <h1 className={styles.heroTitle}>Карточки упражнения вокруг согласованной анимации</h1>
            <p className={styles.heroCopy}>
              Оставил один motion-pattern и разложил вокруг него разные product-card направления. В каждом варианте есть
              градиентная база, фоновый график как вторичный слой, прогресс до цели и mobile-first логика: одна карточка
              в экран, горизонтальный свайп для сравнения.
            </p>
          </div>

          <div className={styles.heroPills}>
            <div className={styles.heroPill}>
              <div className={styles.heroPillLabel}>Что уже вшито</div>
              <div className={styles.heroPillValue}>Прогресс к цели, фоновые графики, живой буфер, свайповая карусель</div>
            </div>
            <div className={styles.heroPill}>
              <div className={styles.heroPillLabel}>Что сравниваем</div>
              <div className={styles.heroPillValue}>Иерархию, тон UI, плотность метрик, вес графика и место CTA в карточке</div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.carouselHeader}>
        <div>
          <div className={styles.carouselTitle}>Горизонтальная лаборатория</div>
          <div className={styles.carouselHint}>Свайп влево и вправо. На мобиле карточка занимает один экран.</div>
        </div>
        <div className={styles.carouselCount}>{EXERCISE_CARD_CONCEPTS.length} вариантов</div>
      </div>

      <div className={styles.carousel} aria-label="Варианты карточек упражнений">
        <div className={styles.track}>
          {EXERCISE_CARD_CONCEPTS.map((concept) => (
            <div key={concept.id} className={styles.slide}>
              <ExerciseConceptCard concept={concept} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
