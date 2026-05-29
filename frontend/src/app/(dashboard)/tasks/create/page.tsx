'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CreateTaskRoute() {
  const router = useRouter();

  useEffect(() => {
    router.push('/tasks?create=true');
  }, [router]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
      <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
      <span className="text-sm font-semibold text-[#92400E]">Opening action creator...</span>
    </div>
  );
}

