// src/components/admin/StatusBadge.jsx
const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    blocked: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    closed: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;