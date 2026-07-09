import MarioAvatar, { charData } from './MarioAvatar';

export default function AvatarDisplay({ character, size = 36 }) {
  if (!character) return <span className="avatar-placeholder" style={{ width: size, height: size }} />;
  if (charData[character]) {
    return <MarioAvatar character={character} size={size} />;
  }
  return <span className="avatar-emoji-fallback" style={{ fontSize: size * 0.65 }}>{character}</span>;
}