export const rolePermissions = {
  student: ["view:self", "update:self"],
  teacher: ["view:student", "update:result"],
  staff: ["view:student", "manage:fees"],
  principal: [
    "view:student",
    "update:result",
    "manage:teacher",
    "manage:staff",
    "manage:user",
  ],
  "super-admin": ["*"],
  admin: ["*"],
};
