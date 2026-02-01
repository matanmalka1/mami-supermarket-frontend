type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="p-12 text-center text-gray-400 font-bold space-y-3 border rounded-3xl bg-white/70">
    <p className="text-lg text-gray-600">{title}</p>
    {description && <p className="text-sm text-gray-400 font-medium">{description}</p>}
    {action && <div className="pt-2 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
