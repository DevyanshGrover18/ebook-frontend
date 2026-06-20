import { useState } from 'react';

/**
 * Controlled customer information form.
 * Validates on blur; highlights fields with a success ring on valid input
 * and shows inline error text on invalid blur.
 */
function CustomerForm({ formData, onChange }) {
  const [touched, setTouched] = useState({ fullName: false, email: false });
  const [errors, setErrors] = useState({ fullName: '', email: '' });

  const validate = (name, value) => {
    if (name === 'fullName') {
      return value.trim().length < 2 ? 'Please enter your full name.' : '';
    }
    if (name === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ''
        : 'Please enter a valid email address.';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
    // Clear error while the user is actively typing
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const getInputClass = (name) => {
    const base =
      'bg-transparent border rounded-xl p-3 outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 w-full';
    if (touched[name] && errors[name]) return `${base} border-error focus:border-error focus:ring-1 focus:ring-error`;
    if (touched[name] && !errors[name]) return `${base} border-secondary/60 focus:border-secondary focus:ring-1 focus:ring-secondary`;
    return `${base} border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary`;
  };

  return (
    <section
      className="bg-surface-container-lowest rounded-xl p-stack-md md:p-stack-lg border border-outline-variant/30"
      aria-label="Customer information"
    >
      <h2 className="font-title-lg text-title-lg text-on-surface mb-stack-md">
        Customer Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="fullName"
            className="font-label-md text-label-md text-on-surface-variant px-1"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Johnathan Doe"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClass('fullName')}
          />
          {touched.fullName && errors.fullName && (
            <p className="text-error font-label-sm text-label-sm px-1" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-label-md text-label-md text-on-surface-variant px-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="counsel@legalform.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClass('email')}
          />
          {touched.email && errors.email && (
            <p className="text-error font-label-sm text-label-sm px-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CustomerForm;
