"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Import the default CSS

const PageLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When a new page navigation starts, show the progress bar
    NProgress.start();

    // When the page has finished loading, hide the progress bar
    NProgress.done();
  }, [pathname, searchParams]); // Re-run this effect whenever the URL changes

  // This component doesn't render anything itself, it just manages the loader
  return null; 
};

export default PageLoader;