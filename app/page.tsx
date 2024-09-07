'use client';

import { useRouter } from 'next/navigation';
import { FluidBackground } from '@/components/home';

export default function Home() {
  const router = useRouter();
  return <FluidBackground onNavigate={router.push} />;
}
