export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in duration-300 flex flex-1 flex-col">
      {children}
    </div>
  );
}
