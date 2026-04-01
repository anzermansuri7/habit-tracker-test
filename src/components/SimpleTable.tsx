interface SimpleTableProps {
  columns: string[];
  rows: (string | number)[][];
}

export function SimpleTable({ columns, rows }: SimpleTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-100">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-brand-50 text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-2 text-left font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-brand-100">
              {row.map((cell, i) => (
                <td key={i} className="px-3 py-2 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
