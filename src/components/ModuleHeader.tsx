interface Props {
  title: string;
  description: string;
}

export function ModuleHeader({ title, description }: Props) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-stone-800">{title}</h1>
      <p className="text-stone-600">{description}</p>
    </header>
  );
}
