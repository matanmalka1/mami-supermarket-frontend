
type AvatarBadgeProps = {
  name?: string | null;
  email?: string | null;
  size?: number;
  className?: string;
};

const getInitials = (name?: string | null, email?: string | null) => {
  const source = (name && name.trim()) || email || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0 && email) {
    return email.slice(0, 2).toUpperCase();
  }
  const initials = parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
  return initials || source.slice(0, 2).toUpperCase();
};

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  name,
  email,
  size = 40,
  className = "",
}) => {
  const initials = getInitials(name, email);
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gray-100 border flex items-center justify-center text-gray-500 text-xs ${className}`}
      aria-label={name || email || "avatar"}
      title={name || email || "avatar"}
    >
      {initials}
    </div>
  );
};

export default AvatarBadge;
