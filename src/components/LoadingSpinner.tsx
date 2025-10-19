'use client';

import { Spinner } from '@/components/ui/spinner';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  );
}
