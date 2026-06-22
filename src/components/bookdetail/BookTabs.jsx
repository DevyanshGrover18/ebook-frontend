import { BookOpen, List, MessageSquare } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'contents', label: 'Contents', icon: List },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
];

function BookTabs({ activeTab, onTabChange, reviewCount }) {
  return (
    <div className="sticky top-18 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex overflow-x-auto scrollbar-none" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${id}`}
                onClick={() => onTabChange(id)}
                className={`flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3.5 sm:py-4 text-label-md font-label-md whitespace-nowrap transition-all duration-200 border-b-2 -mb-px flex-1 sm:flex-none ${
                  isActive
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden xs:inline sm:inline">{label}</span>
                {id === 'reviews' && reviewCount && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                    isActive ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {reviewCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BookTabs;