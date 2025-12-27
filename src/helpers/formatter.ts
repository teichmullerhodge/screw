
export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, unitIndex);

  const formatted =
    Number.isInteger(value) ? value.toString() : value.toFixed(2);

  return `${formatted} ${units[unitIndex]}`;
}

export function getFileName(path: string) {
  return path.split(/[/\\]/).pop();
}

