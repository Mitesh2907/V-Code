// src/components/admin/AnalyticsChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

const AnalyticsChart = ({ data, title }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-white mt-1">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#6366F1" 
              strokeWidth={2}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;