
type Props = {
  title: string;
  children?: React.ReactNode;
};

export function SectionTitle({ title, children }: Props) {
  return (
    <div className="pb-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
}
