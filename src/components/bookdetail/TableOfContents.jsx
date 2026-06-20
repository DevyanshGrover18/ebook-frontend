/**
 * Contents tab panel.
 * Renders a numbered chapter list with title and page-range columns.
 */
function TableOfContents({ chapters }) {
  return (
    <div
      id="tabpanel-contents"
      role="tabpanel"
      aria-labelledby="tab-contents"
      className="py-12"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Table of Contents</h2>

        <div className="border border-outline-variant/30 rounded-xl overflow-hidden divide-y divide-outline-variant/20">
          {chapters.map((item, index) => (
            <div
              key={item.chapter}
              className={`flex items-center gap-6 px-6 py-5 transition-colors duration-200 hover:bg-surface-container-low ${
                index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface'
              }`}
            >
              {/* Chapter number badge */}
              <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <span className="font-label-sm text-label-sm text-on-tertiary-container font-bold">
                  {String(item.chapter).padStart(2, '0')}
                </span>
              </div>

              {/* Chapter title */}
              <p className="font-body-md text-body-md text-on-surface flex-1">{item.title}</p>

              {/* Page range */}
              <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                pp. {item.pages}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableOfContents;
