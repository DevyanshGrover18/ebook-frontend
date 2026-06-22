function TrustMetrics({ metrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter mt-10 md:mt-16 border-t border-outline-variant/30 pt-8 md:pt-10">
      {metrics.map((metric) => (
        <div key={metric.id}>
          <div className="font-headline-md text-2xl md:text-headline-md text-primary">{metric.value}</div>
          <div className="font-label-md text-[11px] md:text-label-md text-outline uppercase tracking-wide">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}

export default TrustMetrics;