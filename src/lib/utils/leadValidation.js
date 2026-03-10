/**
 * Validation utilities for lead forms
 */
export const leadValidation = {
  /**
   * Validate basic lead data (Step 1)
   * @param {Object} leadData - Lead data to validate
   * @returns {Array<string>} Array of error messages
   */
  validateBasicLead(leadData) {
    const errors = [];

    const firstName = (leadData.firstName || '').toString().trim();
    const lastName = (leadData.lastName || '').toString().trim();
    const email = (leadData.email || '').toString().trim();
    const phoneNumber = (leadData.phoneNumber || '').toString().trim();

    if (!firstName) {
      errors.push('First name is required');
    }

    if (!lastName) {
      errors.push('Last name is required');
    }

    if (!email && !phoneNumber) {
      errors.push('Either email or phone number is required');
    }

    if (email && !this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (phoneNumber && !this.isValidPhone(phoneNumber)) {
      errors.push('Please enter a valid phone number');
    }

    return errors;
  },

  /**
   * Validate additional lead data (Step 2)
   * @param {Object} additionalData - Additional data to validate
   * @returns {Array<string>} Array of error messages
   */
  validateAdditionalData(additionalData) {
    const errors = [];

    if (additionalData.bedrooms !== undefined && additionalData.bedrooms !== null) {
      if (!Number.isInteger(additionalData.bedrooms) || additionalData.bedrooms < 0) {
        errors.push('Bedrooms must be a non-negative number');
      }
    }

    if (
      additionalData.maxRent !== undefined &&
      additionalData.maxRent !== null &&
      additionalData.maxRent !== ''
    ) {
      const rent = parseFloat(additionalData.maxRent);
      if (isNaN(rent) || rent < 0) {
        errors.push('Maximum rent must be a valid positive number');
      }
    }

    if (
      additionalData.monthlyIncome !== undefined &&
      additionalData.monthlyIncome !== null &&
      additionalData.monthlyIncome !== ''
    ) {
      const income = parseFloat(additionalData.monthlyIncome);
      if (isNaN(income) || income < 0) {
        errors.push('Monthly income must be a valid positive number');
      }
    }

    if (
      additionalData.desiredMoveIn !== undefined &&
      additionalData.desiredMoveIn !== null &&
      additionalData.desiredMoveIn !== ''
    ) {
      if (!this.isValidDate(additionalData.desiredMoveIn)) {
        errors.push('Please enter a valid move-in date');
      }
    }

    return errors;
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid
   */
  isValidPhone(phone) {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length >= 10;
  },

  /**
   * Validate date format (YYYY-MM-DD)
   * @param {string} dateString - Date string to validate
   * @returns {boolean} True if valid
   */
  isValidDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },
};
