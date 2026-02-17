
export const APP_CONFIG = {
  SUPERADMIN_EMAIL: 'admin@superadmin.myr',
  COORDINATOR_DOMAIN: '@ojtcoord.com',
  DEFAULT_ADMIN_PASSWORD: 'password123', // Used for initial seeding if necessary
};

export const getRoleFromEmail = (email: string): 'SUPERADMIN' | 'COORDINATOR' | 'STUDENT' => {
  if (email === APP_CONFIG.SUPERADMIN_EMAIL) return 'SUPERADMIN';
  if (email.endsWith(APP_CONFIG.COORDINATOR_DOMAIN)) return 'COORDINATOR';
  return 'STUDENT';
};
