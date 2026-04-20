'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/marketplace');
  }, [router]);

  return null;
}
