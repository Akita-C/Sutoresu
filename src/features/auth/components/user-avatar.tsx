import { useAuth } from "../stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export function UserAvatar() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.name || "");
  const avatarUrl = user.avatarTransformations?.medium || user.avatarUrl || "";

  return (
    <Avatar className="h-9 w-9">
      <AvatarImage src={avatarUrl} alt={user.name || "User"} className="object-cover" />
      <AvatarFallback className="bg-primary text-white dark:text-gray-100 text-sm font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
