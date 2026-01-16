import { decodeProjectToken } from '@/lib/projectToken';
import ProjectDetailClient from './_components/ProjectDetailClient';

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const projectId = decodeProjectToken(params.id);

  return <ProjectDetailClient projectId={projectId} />;
}
