

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="min-h-screen py-5 flex justify-center">{children}</main>;
}
