/**
 * Static cart seed data for the Checkout page.
 * In production, replace with cart state from a global store (Zustand / Redux / Context).
 */
export const initialCartItems = [
  {
    id: 'cart-book-1',
    title: 'Constitutional Jurisprudence',
    author: 'Prof. Julian Sterling',
    format: 'Digital Edition',
    price: 89.0,
    fileSizeMB: 18,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFw4B6cg4mLG9gA54o67SCwf9g_k9IPfK9Wi7fzCCOZtAtVCIfnmFFnzs8rMDTTbD0F8ou-iaDeSvR_ghqzemEoqiVXNO_Iucax5rdzkEJku8eIol1c3-qKWQ8bpYPVb2n5B2uFE737BHW9-d3gf3NbilDatHH_WJFvN6gat1XkwU8wiTG_JP20O11TdoRMRs_AOXHFtj0ZTyOYFNyyuygUUbWV-yMVqT4PoAuoIIROmaBdujg43XqPnJc0NhsOaYdLMgIJ3RIf9Y',
    imageAlt:
      "Premium hardcover 'Constitutional Jurisprudence' — minimalist typography, deep navy blue with gold leaf accents.",
  },
  {
    id: 'cart-book-2',
    title: 'Principles of Civil Law',
    author: 'Hon. Martha Wayne',
    format: 'Digital Edition',
    price: 114.0,
    fileSizeMB: 24,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYtxxQLDejyGPv6DXzv89ZjmYQdnFP-c22grftog-EkG6XGKERHMXy8hyobvG1Y9XCx12aKhaMnLj_eTm2vtBKggD4UcpydeRIYR1zT0mUvmwGlk57ad_uIQzM5wIisKfDUe_naKHrBId62SBMLGmg5uiVVZr2OaeurHjw7o2Yt2eWk7QD0FI2bziEJWhLsQPIxe_ON7mnaF69xzAbrKrT_B-_6I4e7h9QS96EL0sd1PbS85Bs4LUF0bFOGEuA3EkWwkc4knUPX9w',
    imageAlt:
      "Sophisticated 'Principles of Civil Law' — slate grey and cream palette, bold centered serif typography.",
  },
];

/**
 * Discount configuration applied at checkout.
 * `rate` is a fractional value (0.10 = 10%).
 */
export const discount = {
  label: 'Executive Discount',
  rate: 0.10,
};

/** Tax rate applied to the discounted subtotal. */
export const TAX_RATE = 0.075;

/**
 * Purchase perks shown in the Order Summary panel.
 */
export const orderPerks = [
  { id: 'perk-1', label: 'Instant Digital Download' },
  { id: 'perk-2', label: 'Lifetime Access & Updates' },
  { id: 'perk-3', label: 'Read on Any Digital Device' },
  { id: 'perk-4', label: '256-bit Secure Checkout' },
];

/**
 * Payment method options rendered as selectable chips.
 */
export const paymentMethods = [
  { id: 'card', label: 'Card', icon: 'credit_card' },
  { id: 'upi', label: 'UPI', icon: 'account_balance_wallet' },
  { id: 'netbanking', label: 'Net Banking', icon: 'account_balance' },
];
