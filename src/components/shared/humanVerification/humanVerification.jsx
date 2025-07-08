'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import AirplaneIcon from '../../../images/icon-human/airplane.svg';
import BicycleIcon from '../../../images/icon-human/bicycle.svg';
import BusIcon from '../../../images/icon-human/bus.svg';
import CarIcon from '../../../images/icon-human/car.svg';
import DisplayIcon from '../../../images/icon-human/display.svg';
import EarthIcon from '../../../images/icon-human/earth.svg';
import HelicopterIcon from '../../../images/icon-human/helicopter.svg';
import GasStationIcon from '../../../images/icon-human/gas-station.svg';
import HeartIcon from '../../../images/icon-human/heart.svg';
import ParkIcon from '../../../images/icon-human/park.svg';
import RiverIcon from '../../../images/icon-human/river.svg';
import TaxiIcon from '../../../images/icon-human/taxi.svg';
import ShipIcon from '../../../images/icon-human/ship.svg';
import ScooterIcon from '../../../images/icon-human/scooter.svg';
import TruckIcon from '../../../images/icon-human/truck.svg';
import UfoIcon from '../../../images/icon-human/ufo.svg';
import CompassIcon from '../../../images/icon-human/compass.svg';
import RocketIcon from '../../../images/icon-human/rocket.svg';
import ForkliftIcon from '../../../images/icon-human/forklift.svg';
import ElectricCarIcon from '../../../images/icon-human/electric-car.svg';
import PoliceCarIcon from '../../../images/icon-human/police-car.svg';
import Route66Icon from '../../../images/icon-human/route-66.svg';
import ChainIcon from '../../../images/icon-human/chain.svg';
import SpaceShuttleIcon from '../../../images/icon-human/space-shuttle.svg';
import CanoeIcon from '../../../images/icon-human/canoe.svg';
import EscalatorIcon from '../../../images/icon-human/escalator.svg';
import VeniceIcon from '../../../images/icon-human/venice.svg';
import Text from '../text/text';

const icons = [
  { name: 'airplane', component: AirplaneIcon },
  { name: 'bicycle', component: BicycleIcon },
  { name: 'bus', component: BusIcon },
  { name: 'car', component: CarIcon },
  { name: 'display', component: DisplayIcon },
  { name: 'earth', component: EarthIcon },
  { name: 'helicopter', component: HelicopterIcon },
  { name: 'gas-station', component: GasStationIcon },
  { name: 'heart', component: HeartIcon },
  { name: 'park', component: ParkIcon },
  { name: 'river', component: RiverIcon },
  { name: 'taxi', component: TaxiIcon },
  { name: 'ship', component: ShipIcon },
  { name: 'scooter', component: ScooterIcon },
  { name: 'truck', component: TruckIcon },
  { name: 'ufo', component: UfoIcon },
  { name: 'compass', component: CompassIcon },
  { name: 'rocket', component: RocketIcon },
  { name: 'forklift', component: ForkliftIcon },
  { name: 'electric-car', component: ElectricCarIcon },
  { name: 'police-car', component: PoliceCarIcon },
  { name: 'route 66', component: Route66Icon },
  { name: 'chain', component: ChainIcon },
  { name: 'space shuttle', component: SpaceShuttleIcon },
  { name: 'canoe', component: CanoeIcon },
  { name: 'escalator', component: EscalatorIcon },
  { name: 'venice', component: VeniceIcon },
];


const HumanVerification = ({ onVerify }) => {
  const pathname = usePathname();
  const [images, setImages] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [targetIcon, setTargetIcon] = useState(null);
  const [targetIconName, setTargetIconName] = useState('');

  const getRandomIcons = () => {
    const shuffled = [...icons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const resetImages = useCallback(() => {
    const newIcons = getRandomIcons();
    setImages(newIcons);
    const newTargetIcon = newIcons[Math.floor(Math.random() * newIcons.length)];
    setTargetIcon(newTargetIcon);
    setTargetIconName(newTargetIcon.name);
  }, []);

  useEffect(() => {
    setVerifiedName('');
    resetImages();
  }, [pathname, resetImages]);

  const handleImageClick = (iconName) => {
    const isCorrect = iconName === targetIcon?.name;
    setIsVerified(isCorrect);
    onVerify(isCorrect);
    if (!isCorrect) {
      resetImages();
      setVerifiedName('');
    } else {
      setVerifiedName(iconName);
    }
  };

  return (
    <div className="w-full regular-border rounded-[5px] p-[7px]">
      <div className=" flex flex-col items-center gap-[5px]">
        <div className="text-center text-wrap">
          <Text
            type="tiny"
            as="span"
            fontWeight="normal"
            lineHeightValues="none"
          >
            Please prove you are human by selecting the{' '}
          </Text>
          <Text
            type="small"
            as="span"
            fontWeight="normal"
            className="text-green-600"
            lineHeightValues="none"
          >
            {targetIconName}.
          </Text>
        </div>
        <div className="flex flex-row items-center gap-[15px]">
          {images.map((icon, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(icon.name)}
              style={{
                cursor: 'pointer',
                border:
                  isVerified && verifiedName === icon.name
                    ? '1px solid green'
                    : '1px solid black',
                color:
                  isVerified && verifiedName === icon.name ? 'green' : 'black',
              }}
              className="p-[7px]"
            >
              <icon.component width={20} height={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HumanVerification;
