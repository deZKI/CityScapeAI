import CoverageMiddleIcon from '../assets/images/coverage_middle_icon.png';
import CoverageHighIcon from '../assets/images/coverage_high_icon.png';
import CoverageNoneIcon from '../assets/images/coverage_none_icon.png';
import CoverageLowIcon from '../assets/images/coverage_low_icon.png';
import L from 'leaflet';

export function getIconByType(type: string) {
  const coverageHighIcon = L.icon({
    iconUrl: CoverageHighIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
    
  const coverageMiddleIcon = L.icon({
    iconUrl: CoverageMiddleIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
    
  const coverageLowIcon = L.icon({
    iconUrl: CoverageLowIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const coverageNoneIcon = L.icon({
    iconUrl: CoverageHighIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  switch (type) {
    case "high":
      return coverageHighIcon;
    case "middle":
      return coverageMiddleIcon;
    case "low":
      return coverageLowIcon;
    case "none":
      return coverageNoneIcon;
  }
};
