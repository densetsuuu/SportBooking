type UserBannerProps = {
  avatarUrl: string | undefined
}

export function UserBanner({ avatarUrl }: UserBannerProps) {
  return (
    <div
      className="rounded-xl h-25 overflow-hidden bg-cover bg-primary/30"
      style={{
        backgroundImage: `url(${avatarUrl})`,
      }}
    >
      <div className="backdrop-blur-xl h-full w-full"></div>
    </div>
  )
}
