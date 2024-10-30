export function generateStaticParams() {
  // Generate static pages for tables 1-20
  return Array.from({ length: 20 }, (_, i) => ({
    tableNumber: String(i + 1),
  }));
}