/**
 * The root layout is deliberately a pass-through. html and body are rendered in
 * [locale]/layout, because lang and the font variables are only known once the
 * locale has been resolved.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
