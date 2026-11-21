import { Metadata } from 'next';
import { dbStore } from '@/lib/db/store';
import { MythologyStudioStepper } from '@/components/mythology/MythologyStudioStepper';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Mythology Project | Fluvia Flow',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResumeMythologyStudioPage({ params }: { params: { projectId: string } }) {
  const project = dbStore.getMythProjectById(params.projectId);

  if (!project) {
    notFound();
  }

  return <MythologyStudioStepper initialProject={project} />;
}
