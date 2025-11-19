export default function Input({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  className = '',
}: {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        type={type}
        placeholder={placeholder}
        className={`mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 ${className}`}
      />
    </div>
  );
}
