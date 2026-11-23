import Avatar from './Avatar';
import { CUSTOM_AVATAR_KEYS } from '../utils/customAvatars';

export default function AvatarDisplay({ character, size = 36 }) {
  if (!character) return <span className="avatar-placeholder" style={{ width: size, height: size }} />;
  if (CUSTOM_AVATAR_KEYS.has(character)) {
    return <Avatar id={character} size={size} />;
  }
  return <span className="avatar-emoji-fallback" style={{ fontSize: size * 0.65 }}>{character}</span>;
}
