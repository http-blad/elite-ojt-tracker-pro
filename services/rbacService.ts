
import { UserRole, AppPermission, User } from '../types';

const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  SUPERADMIN: [
    AppPermission.MANAGE_SYSTEM,
    AppPermission.VIEW_SYSTEM_LOGS,
    AppPermission.MANAGE_USERS,
    AppPermission.MANAGE_INTERNS,
    AppPermission.VIEW_REPORTS,
    AppPermission.GENERATE_TRAINING_PLANS,
    AppPermission.CHAT_WITH_STUDENTS
  ],
  COORDINATOR: [
    AppPermission.MANAGE_INTERNS,
    AppPermission.VIEW_REPORTS,
    AppPermission.GENERATE_TRAINING_PLANS,
    AppPermission.CHAT_WITH_STUDENTS
  ],
  STUDENT: [
    AppPermission.SUBMIT_LOGS,
    AppPermission.VIEW_OWN_PROGRESS,
    AppPermission.CHAT_WITH_COORDINATOR
  ]
};

export const RBACService = {
  /**
   * Checks if a user has a specific permission based on their role.
   */
  hasPermission(user: User | null, permission: AppPermission): boolean {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  },

  /**
   * Checks if a user has any of the provided roles.
   */
  hasRole(user: User | null, roles: UserRole[]): boolean {
    if (!user) return false;
    return roles.includes(user.role);
  },

  /**
   * Returns all permissions for the given role.
   */
  getPermissionsForRole(role: UserRole): AppPermission[] {
    return ROLE_PERMISSIONS[role] || [];
  }
};
