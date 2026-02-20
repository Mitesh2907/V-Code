// src/components/admin/StatCard.jsx
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'indigo' }) => {
  const colors = {
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    rose: 'from-rose-500 to-pink-600',
    blue: 'from-blue-500 to-cyan-600'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-5`} />
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-50" />
        
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
            
            {change && (
              <div className="flex items-center gap-1 mt-3">
                {changeType === 'positive' ? (
                  <ArrowUp size={16} className="text-emerald-400" />
                ) : (
                  <ArrowDown size={16} className="text-rose-400" />
                )}
                <span className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {change}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={`p-3 bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        
        {/* Sparkline effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </motion.div>
  );
};

export default StatCard;