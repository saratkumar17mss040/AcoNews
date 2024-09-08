export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
