export default function Mypagelayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="bg-[#F9F9FB]">{children}</div>
    </>
  );
}
