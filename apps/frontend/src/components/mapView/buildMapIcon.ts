import L from 'leaflet';
import type { MapPoint } from '../../api/map';

/** Kind pris en charge pour le rendu des icônes (inclut district pour les points étendus côté UI). */
export type MapIconKind = MapPoint['kind'] | 'district';

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/** Type de ville déduit de l’URL d’icône : capital > city > fortified > village (taille décroissante). */
export function getCityIconTier(iconUrl: string | null | undefined): 'capital' | 'city' | 'fortified' | 'village' {
  if (!iconUrl) return 'city';
  const u = iconUrl.toLowerCase();
  if (u.includes('capital')) return 'capital';
  if (u.includes('village')) return 'village';
  if (u.includes('fortified')) return 'fortified';
  return 'city';
}

const KIND_COLORS: Record<MapIconKind, string> = {
  kingdom: '#f4b400',
  city: '#1a73e8',
  district: '#8b4513',
  place: '#34a853',
  person: '#d93025',
  organisation: '#7c4dff',
  unknown: '#9aa0a6',
};

const MIN_ZOOM = -2;
const MAX_ZOOM = 4;

function scaleFactorForZoom(zoom: number): number {
  return Math.min(Math.max((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM), 0.15), 1);
}

/**
 * Construit l’icône Leaflet (DivIcon) pour un point carte selon le type et le zoom.
 */
export function buildMapIcon(
  kind: MapIconKind,
  zoom: number,
  iconUrl?: string | null,
  kingdomColor?: string | null,
  name?: string,
  flag?: string | null,
): L.DivIcon {
  const scaleFactor = scaleFactorForZoom(zoom);

  const cityImageUrl = kind === 'city' && iconUrl ? iconUrl : null;
  if (kind === 'city' && cityImageUrl) {
    const tier = getCityIconTier(iconUrl);
    const tierSizes: Record<typeof tier, { base: number; max: number }> = {
      capital: { base: 20, max: 220 },
      city: { base: 15, max: 180 },
      fortified: { base: 7, max: 115 },
      village: { base: 9, max: 100 },
    };
    const { base: baseSize, max: maxSize } = tierSizes[tier];
    const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
    const displaySize = size;
    const fontSize = Math.max(8, Math.round(size * 0.2));
    const overlay = kingdomColor
      ? `<div style="position:absolute;inset:0;background:${kingdomColor};opacity:0.5;pointer-events:none;mask-image:url(&quot;${cityImageUrl}&quot;);mask-size:contain;mask-repeat:no-repeat;mask-position:center;-webkit-mask-image:url(&quot;${cityImageUrl}&quot;);-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat;-webkit-mask-position:center;"></div>`
      : '';
    const labelMaxW = Math.round(displaySize * 2.2);
    const label = name
      ? `<span class="map-city-label" style="font-size:${fontSize}px;max-width:${labelMaxW}px;">${escapeHtml(name)}</span>`
      : '';
    const labelGap = 1;
    const labelZoneH = fontSize * 2.8;
    const totalH = displaySize + (label ? labelZoneH + labelGap : 0);
    const wrapW = Math.max(Math.round(displaySize * 1.5), labelMaxW);
    return L.divIcon({
      className: 'map-pin-icon map-pin-city',
      html: `<div class="map-pin-city-wrap" style="width:${wrapW}px;">
          <div class="map-pin-icon-box" style="width:${displaySize}px;margin:0 auto;">
            <img src="${cityImageUrl}" alt="" style="width:100%;height:100%;object-fit:contain;object-position:center;display:block;transition:all 0.3s ease;" />
            ${overlay}
          </div>
          ${label}
        </div>`,
      iconSize: [wrapW, totalH],
      iconAnchor: [wrapW / 2, displaySize / 2],
    });
  }

  if (kind === 'city' && name) {
    const baseSize = 6;
    const maxSize = 90;
    const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
    const fontSize = Math.max(7, Math.round(size * 0.5));
    const dotColor = kingdomColor ?? KIND_COLORS.city;
    const totalW = Math.max(size, 140);
    const labelGap = 1;
    const labelZoneH = fontSize * 2.8;
    const totalH = size + labelZoneH + labelGap;
    const label = `<span class="map-city-label" style="font-size:${fontSize}px;max-width:${totalW}px;">${escapeHtml(name)}</span>`;
    return L.divIcon({
      className: 'map-pin-icon map-pin-city',
      html: `<div class="map-pin-city-wrap" style="width:${totalW}px;">
          <span class="map-pin-dot" style="background:${dotColor};width:${size}px;display:block;margin:0 auto;transition:all 0.3s ease;"></span>
          ${label}
        </div>`,
      iconSize: [totalW, totalH],
      iconAnchor: [totalW / 2, size / 2],
    });
  }

  if (kind === 'district' && iconUrl) {
    const baseSize = 16;
    const maxSize = 180;
    const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
    return L.divIcon({
      className: 'map-pin-icon',
      html: `<img src="${iconUrl}" alt="District icon" style="width: ${size}px; height: ${size}px; object-fit: contain; transition: all 0.3s ease;" />`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  if (kind === 'place' && iconUrl) {
    const baseSize = 8;
    const maxSize = 72;
    const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
    const showLabel = name && scaleFactor > 0.35;
    const fontSize = Math.max(8, Math.round(size * 0.28));
    const labelMaxW = Math.round(size * 2.8);
    const label = showLabel
      ? `<span class="map-place-label" style="font-size:${fontSize}px;max-width:${labelMaxW}px;">${escapeHtml(name)}</span>`
      : '';
    const labelGap = 2;
    const labelZoneH = showLabel ? fontSize * 2.6 : 0;
    const totalH = size + (showLabel ? labelZoneH + labelGap : 0);
    const wrapW = Math.max(size, showLabel ? labelMaxW : 0);
    return L.divIcon({
      className: 'map-pin-icon map-pin-place',
      html: `<div class="map-pin-place-wrap" style="width:${wrapW}px;">
        <div style="width:${size}px;margin:0 auto;">
          <img src="${iconUrl}" alt="Place icon" style="width:${size}px;height:${size}px;object-fit:contain;transition:all 0.3s ease;display:block;" />
        </div>
        ${label}
      </div>`,
      iconSize: [wrapW, totalH],
      iconAnchor: [wrapW / 2, size / 2],
    });
  }

  if (kind === 'kingdom') {
    const baseSize = 6;
    const maxSize = 90;
    const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
    const iconSize = flag ? size * 4 : size;
    const fontSize = Math.max(12, Math.round(size * 0.55));
    const dotColor = kingdomColor ?? KIND_COLORS.kingdom;
    const estimatedLabelW = name
      ? Math.max(iconSize, Math.round(name.length * fontSize * 0.62) + 20)
      : iconSize;
    const totalW = estimatedLabelW;
    const labelGap = 2;
    const labelZoneH = fontSize * 3;
    const totalH = iconSize + (name ? labelZoneH + labelGap : 0);
    const label = name
      ? `<span class="map-kingdom-label" style="font-size:${fontSize}px;">${escapeHtml(name)}</span>`
      : '';
    const anchorY = totalH - iconSize / 2;
    const iconPart = flag
      ? `<img src="${escapeHtml(flag)}" alt="" style="width:${iconSize}px;height:${iconSize}px;object-fit:contain;object-position:center;display:block;margin:0 auto;" />`
      : `<span class="map-pin-dot" style="background:${dotColor};width:${size}px;height:${size}px;display:block;margin:0 auto;transition:all 0.3s ease;"></span>`;
    return L.divIcon({
      className: 'map-pin-icon map-pin-kingdom',
      html: `<div class="map-pin-kingdom-wrap" style="width:${totalW}px;">
          ${label}
          ${iconPart}
        </div>`,
      iconSize: [totalW, totalH],
      iconAnchor: [totalW / 2, anchorY],
    });
  }

  if (kind === 'person') {
    const baseSize = 8;
    const maxSize = 120;
    const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
    return L.divIcon({
      className: 'map-pin-icon',
      html: `<img src="/Icon/person.png" alt="Person icon" style="width: ${size}px; height: ${size}px; object-fit: contain; transition: all 0.3s ease;" />`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  const baseSize = 6;
  const maxSize = 90;
  const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
  const dotColor = kind === 'city' && kingdomColor ? kingdomColor : KIND_COLORS[kind];
  return L.divIcon({
    className: 'map-pin-icon',
    html: `<span class="map-pin-dot" style="background:${dotColor}; width: ${size}px; height: ${size}px; transition: all 0.3s ease;"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function zIndexOffsetForKind(kind: MapIconKind): number {
  switch (kind) {
    case 'kingdom':
      return 400;
    case 'city':
      return 300;
    case 'place':
      return 200;
    case 'person':
      return 100;
    case 'organisation':
      return 150;
    default:
      return 0;
  }
}
