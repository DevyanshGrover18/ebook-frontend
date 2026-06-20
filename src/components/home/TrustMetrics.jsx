/**
 * Renders a row of stat blocks. Pure presentational component driven by
 * an array of { id, value, label } so it can be reused for any KPI strip.
 */
function TrustMetrics({ metrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mt-16 border-t border-outline-variant/30 pt-10">
      {metrics.map((metric) => (
        <div key={metric.id}>
          <div className="font-headline-md text-headline-md text-primary">{metric.value}</div>
          <div className="font-label-md text-label-md text-outline uppercase">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}

export default TrustMetrics;