import { useEffect, useRef, useState } from "react"
import { FormatDuration } from "../utils/FormatDuration"
import { formatTimeAgo } from "../utils/FormatTimeAgo"


type VideoGridItemProps = {
  id:string
  title: string
  channel:{
    id:string
    name:string
    profileUrl:string
  }
  views:number
  postedAt: Date
  duration:number
  thumbnailUrl:string
  videoUrl:string
}

const VIEW_FORMATTER = new Intl.NumberFormat(undefined, {notation:"compact"})

export function VideoGridItem({
  id, 
  title, 
  channel, 
  views, 
  postedAt, 
  duration, 
  thumbnailUrl, 
  videoUrl
}: VideoGridItemProps){
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if(videoRef.current == null) return

    if(isVideoPlaying){
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }else{
      videoRef.current.pause()
    }
  }, [isVideoPlaying])
  return (
    <div 
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsVideoPlaying(true)}
      onMouseLeave={() => setIsVideoPlaying(false)}
    >
      <a href={`/watch?v=${id}`} className="relative aspect-video">
        <img 
          src={thumbnailUrl} 
          className={`block w-full h-full object-cover transition-[border-radius] duration-200 ${isVideoPlaying ? "rounded-none" : "rounded-xl"}`} />
        <div className="absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded ">
          {FormatDuration(duration)}
        </div>
        {/* video element */}
        <video
          className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 ${isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"}`}
          ref={videoRef}
          muted
          playsInline
          src={videoUrl}
        />
      </a>
      {/* video details */}
      <div className="flex gap-2">
        {/* Channel profile */}
        <a href={`/@${channel.id}`} className="flex-shrink-0">
          <img src={channel.profileUrl} className="w-12 h-12 rounded-full" />
        </a>
        <div className="flex flex-col">
          <a href={`/watch?v=${id}`} className="font-bold">
            {title}
          </a>
          <a href={`/@${channel.id}`} className="text-secondary-text text-sm">
            {channel.name}
          </a>
          
          <div className="text-secondary-text text-sm">
            {VIEW_FORMATTER.format(views)} views • {formatTimeAgo(postedAt)}
          </div>
        </div>
      </div>
      
    </div>
  )
}