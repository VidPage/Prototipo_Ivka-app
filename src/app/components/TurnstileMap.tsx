import { MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface Turnstile {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  fare: number;
  status: 'En línea' | 'Fuera de línea' | 'Mantenimiento';
  passageTime: number;
  todayPasses: number;
  todayEarnings: number;
}

interface TurnstileMapProps {
  turnstiles: Turnstile[];
  onSelectTurnstile: (turnstile: Turnstile) => void;
  selectedTurnstile?: Turnstile;
}

export function TurnstileMap({ turnstiles, onSelectTurnstile, selectedTurnstile }: TurnstileMapProps) {
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 19.4326, lng: -99.1332 });
  const [hoveredTurnstile, setHoveredTurnstile] = useState<string | null>(null);

  useEffect(() => {
    if (turnstiles.length > 0) {
      const avgLat = turnstiles.reduce((sum, t) => sum + t.lat, 0) / turnstiles.length;
      const avgLng = turnstiles.reduce((sum, t) => sum + t.lng, 0) / turnstiles.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
  }, [turnstiles]);

  const latLngToPixel = (lat: number, lng: number, zoom: number) => {
    const scale = 256 * Math.pow(2, zoom);
    const worldX = (lng + 180) / 360 * scale;
    const worldY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * scale;
    return { x: worldX, y: worldY };
  };

  const centerPixel = latLngToPixel(center.lat, center.lng, zoom);

  const getTileUrl = (x: number, y: number, z: number) => {
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  };

  const mapWidth = 800;
  const mapHeight = 600;
  const tileSize = 256;

  const centerTileX = Math.floor(centerPixel.x / tileSize);
  const centerTileY = Math.floor(centerPixel.y / tileSize);

  const tilesX = Math.ceil(mapWidth / tileSize) + 2;
  const tilesY = Math.ceil(mapHeight / tileSize) + 2;

  const offsetX = (mapWidth / 2) - (centerPixel.x % tileSize);
  const offsetY = (mapHeight / 2) - (centerPixel.y % tileSize);

  const tiles = [];
  for (let ty = -Math.floor(tilesY / 2); ty <= Math.ceil(tilesY / 2); ty++) {
    for (let tx = -Math.floor(tilesX / 2); tx <= Math.ceil(tilesX / 2); tx++) {
      const tileX = centerTileX + tx;
      const tileY = centerTileY + ty;
      const maxTile = Math.pow(2, zoom);

      if (tileX >= 0 && tileX < maxTile && tileY >= 0 && tileY < maxTile) {
        tiles.push({
          x: tileX,
          y: tileY,
          px: offsetX + tx * tileSize,
          py: offsetY + ty * tileSize,
        });
      }
    }
  }

  const getMarkerPosition = (lat: number, lng: number) => {
    const pixel = latLngToPixel(lat, lng, zoom);
    const x = (mapWidth / 2) + (pixel.x - centerPixel.x);
    const y = (mapHeight / 2) + (pixel.y - centerPixel.y);
    return { x, y };
  };

  const getStatusColor = (status: string) => {
    if (status === 'En línea') return 'bg-green-500';
    if (status === 'Fuera de línea') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const handleZoomIn = () => {
    if (zoom < 18) setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    if (zoom > 8) setZoom(zoom - 1);
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border shadow-lg relative bg-gray-100">
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: mapWidth, height: mapHeight, margin: 'auto' }}
      >
        {tiles.map((tile, idx) => (
          <img
            key={idx}
            src={getTileUrl(tile.x, tile.y, zoom)}
            alt=""
            className="absolute pointer-events-none"
            style={{
              left: tile.px,
              top: tile.py,
              width: tileSize,
              height: tileSize,
            }}
          />
        ))}

        {turnstiles.map((turnstile) => {
          const pos = getMarkerPosition(turnstile.lat, turnstile.lng);
          const isSelected = selectedTurnstile?.id === turnstile.id;
          const isHovered = hoveredTurnstile === turnstile.id;

          if (pos.x < -50 || pos.x > mapWidth + 50 || pos.y < -50 || pos.y > mapHeight + 50) {
            return null;
          }

          return (
            <div
              key={turnstile.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-10"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => onSelectTurnstile(turnstile)}
              onMouseEnter={() => setHoveredTurnstile(turnstile.id)}
              onMouseLeave={() => setHoveredTurnstile(null)}
            >
              <div className={`relative transition-all ${isSelected ? 'scale-125' : isHovered ? 'scale-110' : 'scale-100'}`}>
                <div
                  className={`${getStatusColor(turnstile.status)} rounded-full p-2.5 shadow-lg border-3 border-white ${
                    isSelected ? 'ring-4' : ''
                  }`}
                  style={isSelected ? { '--tw-ring-color': '#314270', boxShadow: '0 0 0 4px rgba(49, 66, 112, 0.4)' } as React.CSSProperties : {}}
                >
                  <MapPin size={28} className="text-white" fill="white" />
                </div>

                {(isSelected || isHovered) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl px-4 py-3 min-w-[240px] border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                    <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-9 border-r-9 border-t-9 border-l-transparent border-r-transparent border-t-gray-200"></div>

                    <h3 className="font-semibold text-base mb-1">{turnstile.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{turnstile.address}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        turnstile.status === 'En línea' ? 'bg-green-500' :
                        turnstile.status === 'Fuera de línea' ? 'bg-red-500' : 'bg-yellow-500'
                      } animate-pulse`}></span>
                      <span className="text-sm capitalize font-medium">{turnstile.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Pasos hoy</p>
                        <p className="font-semibold text-lg">{turnstile.todayPasses}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Ganancias</p>
                        <p className="font-semibold text-lg">${turnstile.todayEarnings}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-20 border border-gray-200">
        <div className="flex items-center gap-2">
          <MapPin size={18} style={{ color: '#314270' }} />
          <span className="font-semibold text-sm">Mapa de Ubicaciones</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 z-20 border border-gray-200">
        <div className="text-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <span className="font-medium">En línea</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="font-medium">Mantenimiento</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <span className="font-medium">Fuera de línea</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={handleZoomIn}
          className="bg-white rounded-lg shadow-lg p-2.5 hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Acercar"
        >
          <ZoomIn size={20} className="text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded-lg shadow-lg p-2.5 hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Alejar"
        >
          <ZoomOut size={20} className="text-gray-700" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-xs font-medium text-gray-700 z-20 border border-gray-200">
        {turnstiles.length} torniquete{turnstiles.length !== 1 ? 's' : ''} • Zoom: {zoom}
      </div>

      <div className="absolute bottom-2 right-20 text-[10px] text-gray-500 bg-white/80 px-2 py-1 rounded z-20">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
