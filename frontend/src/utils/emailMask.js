// Utility function to mask email addresses for privileged users
export const maskEmail = (email, role) => {
    // Only mask emails for admin, co-admin, and accountant roles
    const privilegedRoles = ['admin', 'co-admin', 'accountant'];
    if (!privilegedRoles.includes(role)) {
        return email;
    }

    if (!email || !email.includes('@')) {
        return email;
    }

    const [localPart, domain] = email.split('@');

    // Mask the local part, keeping first 2 characters and last 2 characters
    let maskedLocal = '';
    if (localPart.length <= 2) {
        maskedLocal = localPart;
    } else if (localPart.length <= 4) {
        maskedLocal = localPart.substring(0, 1) + '*'.repeat(localPart.length - 2) + localPart.substring(localPart.length - 1);
    } else {
        maskedLocal = localPart.substring(0, 2) + '*'.repeat(localPart.length - 4) + localPart.substring(localPart.length - 2);
    }

    // Mask the domain part, keeping first character and extension
    const domainParts = domain.split('.');
    let maskedDomain = '';
    if (domainParts.length > 1) {
        const domainName = domainParts[0];
        const extension = domainParts.slice(1).join('.');
        if (domainName.length <= 1) {
            maskedDomain = domainName;
        } else {
            maskedDomain = domainName.substring(0, 1) + '*'.repeat(domainName.length - 2) + domainName.substring(domainName.length - 1);
        }
        maskedDomain += '.' + extension;
    } else {
        maskedDomain = domain;
    }

    return maskedLocal + '@' + maskedDomain;
};
