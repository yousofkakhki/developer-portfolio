import ProjectVisual from '@/app/components/homepage/projects/project-visual';
import ProjectMediaFigure from './project-media-figure';

export default function ProjectHeroMedia({
  project,
  roleLabels = {},
  fallbackLabel,
  fallbackCategory,
  priority = false,
  compact = false,
}) {
  const primary = project.media?.find(item => item.primary && item.publicApproved && !item.sensitive);

  if (!primary) {
    if (project.publicationType !== 'project-snapshot') return null;

    return (
      <div className={compact ? 'project-hero-media project-hero-media--compact' : 'project-hero-media'}>
        <ProjectVisual
          publicationType={project.publicationType}
          projectLabel={project.name}
          visualKind={project.visualKind}
          briefLabel={fallbackLabel}
          categoryLabel={fallbackCategory}
        />
      </div>
    );
  }

  return (
    <ProjectMediaFigure
      media={primary}
      roleLabel={roleLabels[primary.evidenceRole]}
      priority={priority}
      className={compact ? 'project-hero-media project-hero-media--compact' : 'project-hero-media'}
    />
  );
}
