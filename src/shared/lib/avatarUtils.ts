const AVATAR_COLORS = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
] as const;

export function getAvatarColor(username: string): string {
    const index = username.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}
