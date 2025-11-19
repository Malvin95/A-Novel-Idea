export default function Button({
  children,
  onClick,
  type = 'button',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}) {
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
