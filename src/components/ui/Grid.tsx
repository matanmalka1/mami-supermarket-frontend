import React from 'react';

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = 2 | 4 | 6 | 8 | 10 | 12 | 16;

interface GridProps {
  children: React.ReactNode;
  cols?: GridCols;
  gap?: GridGap;
  className?: string;
}

const colMap: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-2 md:grid-cols-6 lg:grid-cols-12'
};

const gapMap: Record<GridGap, string> = {
  2: 'gap-2',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16'
};

const Grid: React.FC<GridProps> = ({ children, cols = 4, gap = 12, className = '' }) => {
  return (
    <div className={`grid ${colMap[cols]} ${gapMap[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;