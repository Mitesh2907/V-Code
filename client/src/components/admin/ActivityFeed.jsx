// src/components/admin/ActivityFeed.jsx
import { motion } from 'framer-motion';
import { UserPlus, DoorOpen, MessageSquare, Video, FileText } from 'lucide-react';

const activities = [
  { id: 1, type: 'user', user: 'John Doe', action: 'joined the platform', time: '2 minutes ago', icon: UserPlus, color: 'indigo' },
  { id: 2, type: 'room', user: 'Jane Smith', action: 'created room "React Workshop"', time: '5 minutes ago', icon: DoorOpen, color: 'emerald' },
  { id: 3, type: 'message', user: 'Mike Johnson', action: 'sent 50 messages in #general', time: '10 minutes ago', icon: MessageSquare, color: 'amber' },
  { id: 4, type: 'video', user: 'Sarah Wilson', action: 'started video call in "Team Meeting"', time: '15 minutes ago', icon: Video, color: 'rose' },
  { id: 5, type: 'file', user: 'Alex Brown', action: 'created file "styles.css"', time: '20 minutes ago', icon: FileText, color: 'blue' },
];

const colorClasses = {
  indigo: 'bg-indigo-500/20 text-indigo-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/20 text-rose-400',
  blue: 'bg-blue-500/20 text-blue-400',
};

const ActivityFeed = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 group"
            >
              <div className={`p-2 rounded-xl ${colorClasses[activity.color]} group-hover:scale-110 transition-transform`}>
                <Icon size={16} />
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">{activity.user}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;