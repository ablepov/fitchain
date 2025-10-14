export function getDayBoundsISO(timezone: string, date: Date = new Date()): { startISO: string; endISO: string } {
  // MVP: вычисляем локальную дату в указанной TZ через toLocaleString,
  // затем собираем полуночь и конец дня в этой TZ и конвертируем обратно в ISO (UTC)
  const locale = 'en-US';
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== 'literal') acc[p.type] = p.value;
      return acc;
    }, {});

  // YYYY-MM-DD from TZ date
  const yyyy = parts.year;
  const mm = parts.month;
  const dd = parts.day;
  // Construct date strings in the provided TZ, then parse with Date by reformatting with timeZoneName hack (not robust, but ok for MVP)
  // Simpler: use fixed times and then shift via target TZ offset. We'll estimate offset using the formatted hours difference.
  // To avoid complexity, we create two Date objects from locale string and rely on JS parsing; as a fallback, use UTC midnight then adjust.

  const startLocal = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  const endLocal = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999`);

  // Now compute offset between provided TZ and system for given date
  const sysStart = new Date(startLocal.toISOString());
  const sysEnd = new Date(endLocal.toISOString());

  // Format start in target TZ and system to approximate offset
  const tzStartHour = Number(
    new Intl.DateTimeFormat(locale, { timeZone: timezone, hour: '2-digit', hour12: false })
      .formatToParts(startLocal)
      .find((p) => p.type === 'hour')?.value ?? '0'
  );
  const sysStartHour = Number(
    new Intl.DateTimeFormat(locale, { hour: '2-digit', hour12: false })
      .formatToParts(startLocal)
      .find((p) => p.type === 'hour')?.value ?? '0'
  );
  const hourDelta = tzStartHour - sysStartHour;

  const startUTC = new Date(sysStart.getTime() - hourDelta * 60 * 60 * 1000);
  const endUTC = new Date(sysEnd.getTime() - hourDelta * 60 * 60 * 1000);

  return { startISO: startUTC.toISOString(), endISO: endUTC.toISOString() };
}
