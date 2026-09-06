export default function ProjectStateTransitionTable({ stateTransitions }) {
  if (!stateTransitions?.rows?.length || stateTransitions.columns?.length !== 3) return null;

  return (
    <section className="brand-route__section project-state-transitions" aria-labelledby="project-state-transitions-title">
      <div className="project-state-transitions__scroll" tabIndex="0">
        <table>
          <caption id="project-state-transitions-title">{stateTransitions.title}</caption>
          <thead>
            <tr>
              {stateTransitions.columns.map(column => <th key={column} scope="col">{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {stateTransitions.rows.map(row => (
              <tr key={row.id}>
                <th scope="row">{row.trigger}</th>
                <td>{row.state}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
