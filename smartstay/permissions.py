from rest_framework import permissions

class IsStaffOrAdminUser(permissions.BasePermission):
    """
    Allows access only to staff or admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_staff or request.user.role in ['STAFF', 'ADMIN']))
