export default function toAMPM(timeString: string): string {
  if (!timeString) return "";

  let time = timeString;

  // If ISO format like "2025-02-02T06:58"
  if (time.includes("T")) {
    time = time.split("T")[1];
  }

  // If seconds exist (HH:MM:SS)
  const parts = time.split(":");
  if (parts.length < 2) return "";

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (isNaN(hour) || isNaN(minute)) return "";

  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
}
