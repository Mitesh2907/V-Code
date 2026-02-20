// src/components/admin/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
            currentPage === i + 1
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {i + 1}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;