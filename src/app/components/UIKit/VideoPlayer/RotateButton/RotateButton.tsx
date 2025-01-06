import React from 'react'

import { RotateLeftOutlined } from '@ant-design/icons'
import { min } from 'ramda'
import { createRoot } from 'react-dom/client'
import type VideoJSComponent from 'video.js/dist/types/component'

import type { Player } from '../VideoJS'

const ROTATION_CLASS_PREFIX = 'rotate-'
const SCALE_CLASS_PREFIX = 'scale-'
const ROTATION_ANGLES = [270, 180, 90]

const calculateScale = (player: Player, video: HTMLVideoElement) => {
  const videoAspectRatio = {
    width: player.videoWidth(),
    height: player.videoHeight(),
  }
  const playerAspectRatio = {
    width: video.offsetWidth,
    height: video.offsetHeight,
  }

  const scaledVideoWidth = playerAspectRatio.height * (videoAspectRatio.width / videoAspectRatio.height)
  const scaledVideoHeight = playerAspectRatio.width * (videoAspectRatio.height / videoAspectRatio.width)

  return playerAspectRatio.width > playerAspectRatio.height
    ? scaledVideoWidth < playerAspectRatio.width
      ? min(
        playerAspectRatio.height / scaledVideoWidth,
        playerAspectRatio.width / playerAspectRatio.height,
      )
      : playerAspectRatio.height / playerAspectRatio.width
    : scaledVideoHeight < playerAspectRatio.height
      ? min(
        playerAspectRatio.height / playerAspectRatio.width,
        playerAspectRatio.width / scaledVideoHeight,
      )
      : playerAspectRatio.width / playerAspectRatio.height
}

const createRotateButton = (
  player: Player,
  controlBar: VideoJSComponent | undefined,
  onRotate?: (rotateAngle?: number) => void,
) => controlBar
  ?.addChild('button', {
    className: 'vjs-visible-text vjs-rotate-btn',

    clickHandler() {
      const currentRotationAngle = Array.from(player.el().classList)
        .find(className => className.startsWith(ROTATION_CLASS_PREFIX))
        ?.slice(ROTATION_CLASS_PREFIX.length)
      const currentScale = Array.from(player.el().classList)
        .find(className => className.startsWith(SCALE_CLASS_PREFIX))
        ?.slice(SCALE_CLASS_PREFIX.length)

      const video = player
        .el()
        .querySelector('video')

      const nextRotationAngle = ROTATION_ANGLES[ROTATION_ANGLES.indexOf(Number(currentRotationAngle)) + 1]
      onRotate?.(nextRotationAngle)

      if (video) {
        const scale = calculateScale(player, video)

        const transformRotate = `rotate(${nextRotationAngle || 0}deg)`
        const transformScale = `scale(${currentScale ? 1 : scale})`
        video.style.transform = transformRotate + transformScale

        player.el().classList.toggle(`scale-${scale}`)
      }

      currentRotationAngle && player.el().classList.toggle(`rotate-${currentRotationAngle}`)
      nextRotationAngle && player.el().classList.toggle(`rotate-${nextRotationAngle}`)
    },
  })

export const addRotateButton = (
  player: Player,
  defaultRotation?: number,
  onRotate?: (rotateAngle?: number) => void,
) => {
  if (defaultRotation) {
    const video = player
      .el()
      .querySelector('video')

    if (video) {
      video.style.transform = `rotate(${defaultRotation}deg)`
      player.el().classList.add(`rotate-${defaultRotation}`)
    }
  }
  const controlBar = player.getChild('ControlBar')
  const pictureInPictureButton = controlBar?.getChild('PictureInPictureToggle')
  const rotateButton = createRotateButton(player, controlBar, onRotate)

  if (rotateButton && pictureInPictureButton) {
    controlBar?.el()
      .insertBefore(rotateButton.el(), pictureInPictureButton.el())
  }

  if (rotateButton) {
    const root = createRoot(rotateButton.el())
    root?.render(<RotateLeftOutlined style={{ fontSize: 20 }} />)
  }
}
