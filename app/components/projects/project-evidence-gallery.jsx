import ProjectMediaFigure from './project-media-figure';

export default function ProjectEvidenceGallery({ media = [], title, roleLabels = {} }) {
  const supportingMedia = media.filter(
    item => !item.primary && item.publicApproved && !item.sensitive,
  );
  if (supportingMedia.length < 2) return null;

  return (
    <section className="brand-route__section project-evidence-gallery" aria-labelledby="visual-evidence-heading">
      <h2 id="visual-evidence-heading" className="brand-route__section-title">{title}</h2>
      <div className="project-evidence-gallery__grid">
        {supportingMedia.map(item => (
          <ProjectMediaFigure
            key={item.id}
            media={item}
            roleLabel={roleLabels[item.evidenceRole]}
          />
        ))}
      </div>
    </section>
  );
}
