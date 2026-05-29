'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SingleTaskRoute() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      router.push(`/tasks?edit=${params.id}`);
    } else {
      router.push('/tasks');
    }
  }, [params.id, router]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
      <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
      <span className="text-sm font-semibold text-[#92400E]">Loading task details...</span>
    </div>
  );
}
