export const Spinner = ({
  size = 48,
  color = '#000000',
  strokeWidth = undefined,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0,
}) => {
  const transforms = []
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
  if (flipHorizontal) transforms.push('scaleX(-1)')
  if (flipVertical) transforms.push('scaleY(-1)')

  const viewBoxSize = 24 + padding * 2
  const viewBoxOffset = -padding
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter:
          shadow > 0
            ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))`
            : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined,
      }}
    >
      <rect width="10" height="10" x="1" y="1" fill="currentColor" rx="1">
        <animate
          id="SVG7WybndBt"
          fill="freeze"
          attributeName="x"
          begin="0;SVGo3aOUHlJ.end"
          dur="0.2s"
          values="1;13"
        />
        <animate
          id="SVGVoKldbWM"
          fill="freeze"
          attributeName="y"
          begin="SVGFpk9ncYc.end"
          dur="0.2s"
          values="1;13"
        />
        <animate
          id="SVGKsXgPbui"
          fill="freeze"
          attributeName="x"
          begin="SVGaI8owdNK.end"
          dur="0.2s"
          values="13;1"
        />
        <animate
          id="SVG7JzAfdGT"
          fill="freeze"
          attributeName="y"
          begin="SVG28A4To9L.end"
          dur="0.2s"
          values="13;1"
        />
      </rect>
      <rect width="10" height="10" x="1" y="13" fill="currentColor" rx="1">
        <animate
          id="SVGUiS2jeZq"
          fill="freeze"
          attributeName="y"
          begin="SVG7WybndBt.end"
          dur="0.2s"
          values="13;1"
        />
        <animate
          id="SVGU0vu2GEM"
          fill="freeze"
          attributeName="x"
          begin="SVGVoKldbWM.end"
          dur="0.2s"
          values="1;13"
        />
        <animate
          id="SVGOIboFeLf"
          fill="freeze"
          attributeName="y"
          begin="SVGKsXgPbui.end"
          dur="0.2s"
          values="1;13"
        />
        <animate
          id="SVG14lAaeuv"
          fill="freeze"
          attributeName="x"
          begin="SVG7JzAfdGT.end"
          dur="0.2s"
          values="13;1"
        />
      </rect>
      <rect width="10" height="10" x="13" y="13" fill="currentColor" rx="1">
        <animate
          id="SVGFpk9ncYc"
          fill="freeze"
          attributeName="x"
          begin="SVGUiS2jeZq.end"
          dur="0.2s"
          values="13;1"
        />
        <animate
          id="SVGaI8owdNK"
          fill="freeze"
          attributeName="y"
          begin="SVGU0vu2GEM.end"
          dur="0.2s"
          values="13;1"
        />
        <animate
          id="SVG28A4To9L"
          fill="freeze"
          attributeName="x"
          begin="SVGOIboFeLf.end"
          dur="0.2s"
          values="1;13"
        />
        <animate
          id="SVGo3aOUHlJ"
          fill="freeze"
          attributeName="y"
          begin="SVG14lAaeuv.end"
          dur="0.2s"
          values="1;13"
        />
      </rect>
    </svg>
  )
}
