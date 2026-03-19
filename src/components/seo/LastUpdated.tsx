export function LastUpdated({ date }: { date?: string }) {
  const displayDate = date || new Date().toISOString().split("T")[0];
  return (
    <p className="text-sm text-zinc-500 mt-2">
      Last updated: <time dateTime={displayDate}>{new Date(displayDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
    </p>
  );
}
