import { Users, Download, BadgeCheck } from 'lucide-react';
import { trustMetrics } from '../../data/trustMetrics.js';

const ICONS = {
  users: Users,
  download: Download,
  verified: BadgeCheck,
};

function TrustMetrics({ metrics = trustMetrics }) {
  return (
    <div className="bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center justify-center divide-x divide-outline-variant/30 py-8">
          {metrics.map((metric) => {
            const Icon = ICONS[metric.icon];
            return (
              <div
                key={metric.id}
                className="flex items-center gap-4 px-10 sm:px-16"
              >
                {/* Lavender icon circle — larger, lighter */}
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-fixed shrink-0">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </span>

                <div className="text-left whitespace-nowrap">
                  <div className="font-headline-sm text-headline-sm text-primary leading-none">
                    {metric.value}
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">
                    {metric.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TrustMetrics;