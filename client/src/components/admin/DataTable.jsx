import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-lg">
      <table className="w-full text-left">
        <thead className="bg-[#0f172a] text-gray-400 text-sm">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="p-4">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm">
          {data.map((row, index) => (
            <tr key={index} className="border-t border-slate-700 hover:bg-slate-800">
              {row.map((cell, i) => (
                <td key={i} className="p-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
