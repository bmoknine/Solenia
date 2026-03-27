import { useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

type Props = {
  position: [number, number];
  icon: L.DivIcon;
  zIndexOffset?: number;
  draggable: boolean;
  eventHandlers: L.LeafletEventHandlerFnMap;
  interactive: boolean;
};

/** Marker avec interpolation ease-out lorsque la position change. */
export function AnimatedMarker({
  position,
  icon,
  zIndexOffset,
  draggable,
  eventHandlers,
  interactive,
}: Props) {
  const markerRef = useRef<L.Marker | null>(null);
  const previousPositionRef = useRef<[number, number] | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!markerRef.current) return;

    const newPos = L.latLng(position[0], position[1]);

    if (
      previousPositionRef.current &&
      (Math.abs(previousPositionRef.current[0] - position[0]) > 0.0001 ||
        Math.abs(previousPositionRef.current[1] - position[1]) > 0.0001)
    ) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const startPos = markerRef.current.getLatLng();
      const endPos = newPos;
      const duration = 400;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - (1 - progress) ** 3;
        const currentLat = startPos.lat + (endPos.lat - startPos.lat) * easeOut;
        const currentLng = startPos.lng + (endPos.lng - startPos.lng) * easeOut;
        markerRef.current?.setLatLng([currentLat, currentLng]);
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (!previousPositionRef.current) {
      markerRef.current.setLatLng(newPos);
    }

    previousPositionRef.current = position;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setIcon(icon);
    }
  }, [icon]);

  return (
    <Marker
      ref={(ref) => {
        if (ref) {
          markerRef.current = ref;
        }
      }}
      position={position}
      icon={icon}
      zIndexOffset={zIndexOffset}
      draggable={draggable}
      eventHandlers={eventHandlers}
      interactive={interactive}
    />
  );
}
