import type { User } from "@/domains/users/types";

export const transformDtoToUser = (dto: any): User => {
  // Handle full_name from /me endpoint or split first/last name
  let firstName = dto.first_name || dto.firstName;
  let lastName = dto.last_name || dto.lastName;

  if (!firstName && !lastName && (dto.full_name || dto.fullName)) {
    const fullName = dto.full_name || dto.fullName;
    const nameParts = fullName.trim().split(/\s+/);
    firstName = nameParts[0] || "";
    lastName = nameParts.slice(1).join(" ") || "";
  }

  return {
    id: dto.id,
    email: dto.email,
    firstName,
    lastName,
    role: dto.role,
    phone: dto.phone,
    avatarUrl: dto.avatar_url || dto.avatarUrl,
  };
};

export const transformUserToRequest = (user: Partial<User>): Record<string, any> => {
  const req: Record<string, any> = {};

  if (user.phone !== undefined) {
    req.phone = user.phone;
  }


  if (user.fullName !== undefined) {
    req.full_name = user.fullName;
  } else if (user.firstName || user.lastName) {
    req.full_name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }

  return req;
};
