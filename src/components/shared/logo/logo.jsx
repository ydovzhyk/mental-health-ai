import Link from 'next/link';
import LogoIcon from '@/images/logo.svg';

const Logo = ({ width = 170, height = 70 }) => {
  return (
    <Link href="/" className="cursor-pointer">
      <LogoIcon
        width={width}
        height={height}
        role="img"
        aria-label="Site logo"
      />
    </Link>
  );
};

export default Logo;
