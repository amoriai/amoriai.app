type AmoriaRow = {
  id: string;
  name: string;
  avatar_image_url: string;
};

type AmoriaAvatarProps = {
  amoria: AmoriaRow;
  animated: boolean;
};

export function AmoriaAvatar({ amoria, animated }: AmoriaAvatarProps) {
  const imageUrl = amoria.avatar_image_url;           // ex: /amoria-m-romantique.png
  const videoUrl = imageUrl.replace(".png", ".mp4");  // ex: /amoria-m-romantique.mp4

  if (animated) {
    return (
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-16 h-16 rounded-full object-cover"
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={amoria.name}
      className="w-16 h-16 rounded-full object-cover"
    />
  );
}
