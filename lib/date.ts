const DATE_PARTS_LOCALE = "en-CA";
const OFFSET_LOCALE = "en-US";

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

export function getDayBoundsISO(timezone: string, date: Date = new Date()): { startISO: string; endISO: string } {
  const parts = getDateParts(timezone, date);
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);

  const start = zonedTimeToUtc(timezone, year, month, day, 0, 0, 0, 0);
  const end = zonedTimeToUtc(timezone, year, month, day, 23, 59, 59, 999);

  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
  };
}
