'use client';

import { PaletteGenerator } from '@/components/generator/PaletteGenerator';

interface GeneratePageProps {
  params: Promise<{
    colors?: string[];
  }>;
}

export default async function GeneratePage({ params }: GeneratePageProps) {
  const resolvedParams = await params;
  const initialColors = resolvedParams.colors?.join('-');

  return <PaletteGenerator initialColors={initialColors} />;
}
