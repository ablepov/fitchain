const DATE_PARTS_LOCALE = "en-CA";
const OFFSET_LOCALE = "en-US";
const WEEKDAY_LOCALE = "en-US";

const WEEKDAY_NAME_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const WEEKDAY_LABELS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;
export const WEEKDAY_ORDER_MONDAY_FIRST = [1, 2, 3, 4, 5, 6, 0] as const;

function getDateParts(timezone: string, date: Date) {
  return new Intl.DateTimeFormat(DATE_PARTS_LOCALE, {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }

      return acc;
    }, {});
}

function getOffsetMinutes(timezone: string, date: Date) {
  const timeZoneName =
    new Intl.DateTimeFormat(OFFSET_LOCALE, {
      timeZone: timezone,
      timeZoneName: "longOffset",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT+00:00";

  const match = timeZoneName.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) {
    return 0;
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);

  return sign * (hours * 60 + minutes);
}

function getDatePartNumbers(timezone: string, date: Date) {
  const parts = getDateParts(timezone, date);

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

function shiftDateParts(dayDelta: number, timezone: string, date: Date) {
  const { year, month, day } = getDatePartNumbers(timezone, date);
  const nextDate = new Date(Date.UTC(year, month - 1, day + dayDelta, 12, 0, 0, 0));

  return getDatePartNumbers(timezone, nextDate);
}

function zonedTimeToUtc(
  timezone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number
) {
  let utcMs = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const offsetMinutes = getOffsetMinutes(timezone, new Date(utcMs));
    const nextUtcMs = Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - offsetMinutes * 60_000;

    if (nextUtcMs === utcMs) {
      break;
    }

    utcMs = nextUtcMs;
  }

  return new Date(utcMs);
}

function getRangeBounds(
  timezone: string,
  start: { year: number; month: number; day: number },
  endExclusive: { year: number; month: number; day: number }
) {
  const startDate = zonedTimeToUtc(timezone, start.year, start.month, start.day, 0, 0, 0, 0);
  const endDate = zonedTimeToUtc(timezone, endExclusive.year, endExclusive.month, endExclusive.day, 0, 0, 0, 0);

  return {
    startISO: startDate.toISOString(),
    endISO: endDate.toISOString(),
  };
}

export function getDayBoundsISO(timezone: string, date: Date = new Date()): { startISO: string; endISO: string } {
  const start = getDatePartNumbers(timezone, date);
  const nextDay = shiftDateParts(1, timezone, date);

  const { startISO, endISO: endExclusiveISO } = getRangeBounds(timezone, start, nextDay);

  return {
    startISO,
    endISO: new Date(new Date(endExclusiveISO).getTime() - 1).toISOString(),
  };
}

export function getWeekdayIndex(timezone: string, date: Date = new Date()) {
  const weekdayName = new Intl.DateTimeFormat(WEEKDAY_LOCALE, {
    timeZone: timezone,
    weekday: "short",
  }).format(date);

  return WEEKDAY_NAME_TO_INDEX[weekdayName] ?? 0;
}

export function getWeekBoundsISO(timezone: string, date: Date = new Date()) {
  const weekday = getWeekdayIndex(timezone, date);
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  const start = shiftDateParts(-daysFromMonday, timezone, date);
  const endExclusive = shiftDateParts(7 - daysFromMonday, timezone, date);

  return getRangeBounds(timezone, start, endExclusive);
}

export function getMonthBoundsISO(timezone: string, date: Date = new Date()) {
  const { year, month } = getDatePartNumbers(timezone, date);
  const nextMonthDate = new Date(Date.UTC(year, month, 1, 12, 0, 0, 0));
  const nextMonth = getDatePartNumbers(timezone, nextMonthDate);

  return getRangeBounds(
    timezone,
    {
      year,
      month,
      day: 1,
    },
    {
      year: nextMonth.year,
      month: nextMonth.month,
      day: 1,
    }
  );
}

export function formatDateKeyInTimezone(timezone: string, date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  const parts = getDateParts(timezone, value);

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatRelativeTimeFromNow(isoString: string | null): string {
  if (!isoString) {
    return "Нет подходов";
  }

  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Только что";
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч назад`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} д назад`;
}
