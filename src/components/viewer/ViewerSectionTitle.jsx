export default function ViewerSectionTitle({ icon: Icon, children }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {Icon && <Icon className="h-5 w-5 text-brand-primary" />}
      <h2 className="text-lg font-bold text-text-primary">{children}</h2>
    </div>
  );
}
