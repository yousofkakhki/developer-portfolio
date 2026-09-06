const isExternalUrl = url => /^https?:\/\//i.test(url || '');

export default function ProjectArtifactList({
  artifacts = [],
  sourceAvailability,
  title,
  privateSourceNote,
}) {
  const approved = artifacts.filter(artifact => artifact.ownerApproved === true && artifact.url);
  const privateSource = sourceAvailability === 'private-client-source';
  if (approved.length === 0 && !privateSource) return null;

  return (
    <section className="brand-route__section project-artifacts" aria-labelledby="project-artifacts-heading">
      <h2 id="project-artifacts-heading" className="brand-route__section-title">{title}</h2>
      {approved.length > 0 && (
        <ul className="project-artifacts__list">
          {approved.map(artifact => (
            <li key={artifact.id}>
              <a
                href={artifact.url}
                {...(isExternalUrl(artifact.url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <strong>{artifact.label}</strong>
                <span>{artifact.description}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {privateSource && <p className="project-artifacts__private-note">{privateSourceNote}</p>}
    </section>
  );
}
