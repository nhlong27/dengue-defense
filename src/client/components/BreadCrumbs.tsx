import React from 'react';
import { ChevronRight } from 'lucide-react';

const BreadCrumbs = ({ routerQueries }: { routerQueries: string[] }) => {
  console.log(routerQueries);
  return (
    <nav className='py-1 border rounded-lg bg-muted mb-4'>
      <ol
        role='list'
        className='mx-auto flex flex-wrap max-w-2xl items-center space-x-2 px-4 lg:max-w-7xl'
      >
        <li>
          <div className='flex items-center'>
            <a href='#' className='text-sm font-medium'>
              Dashboard
            </a>
          </div>
        </li>
        {routerQueries.map((name: string, index: number) => (
          <li key={index}>
            <div className='flex items-center'>
              <ChevronRight size={20} />
              <a
                href='#'
                className={`ml-2 text-sm font-medium capitalize hover:opacity-70 ${
                  routerQueries.at(-1) === name ? '' : ''
                }`}
              >
                {name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
