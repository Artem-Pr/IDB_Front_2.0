import React, {
  useCallback, useEffect, useRef,
} from 'react'

import cn from 'classnames'
import videojs from 'video.js'

import { addRotateButton } from './RotateButton'

import styles from './VideoJS.module.scss'
import 'video.js/dist/video-js.css'

export type Player = ReturnType<typeof videojs> & {
  refresh?: () => void
}

interface VideoPlayerOptions {
  autoplay: Parameters<Player['autoplay']>[0],
  controls: Parameters<Player['controls']>[0],
  fluid: Parameters<Player['fluid']>[0],
  responsive: Parameters<Player['responsive']>[0],
  controlBar?: {
    [key: string]: any
    skipButtons?: {
      forward: number,
      backward: number,
    }
  }
  poster?: string,
  muted?: boolean,
  aspectRatio?: string,
  playbackRates?: number[],
  sources: {
    src: string,
    type: string,
  }[]
}

export interface VideoPlayerProps {
  defaultRotation?: number;
  onPause?: Player['pause'];
  onPlay?: Player['play'];
  onReady?: (player: Player) => void;
  onRotate?: (rotateAngle?: number) => void;
  options: Partial<VideoPlayerOptions>;
}

const initialOptions: VideoPlayerOptions = {
  autoplay: false,
  controls: true,
  responsive: true,
  fluid: true,
  sources: [],
}

export const VideoJS = ({
  defaultRotation,
  onPause,
  onPlay,
  onReady,
  onRotate,
  options,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player | null>(null)

  const handlePlayerReady = useCallback((player: Player) => {
    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('pause', () => {
      videojs.log('player will pause')
      onPause?.()
    })

    player.on('play', () => {
      videojs.log('player will play')
      onReady?.(player)
      onPlay?.()
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }, [onPause, onReady, onPlay])

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
    const videoElement = document.createElement('video-js')
    videoElement.classList.add('vjs-big-play-centered')

    if (!playerRef.current || playerRef.current.isDisposed()) {
      videoRef?.current?.appendChild(videoElement)

      const player: Player = playerRef.current = videojs(videoElement, {
        ...initialOptions,
        ...options,
      }, () => {
        videojs.log('player is ready')

        addRotateButton(player, defaultRotation, onRotate)

        handlePlayerReady(player)
        onReady && onReady(player)
      })

    // You could update an existing player in the `else` block here
    // on prop change, for example:
    } else {
      const player = playerRef.current

      player?.autoplay(options.autoplay)
      player?.src(options.sources)
    }
   
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player className={cn(styles.videoJS, 'w-100')}>
      <div ref={videoRef} className="d-flex h-100 position-relative" />
    </div>
  )
}
