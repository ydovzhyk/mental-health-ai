import NavLink from '@/components/shared/navLink/navLink';
import { usePathname } from 'next/navigation';
import Text from '@/components/shared/text/text';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="relative w-full py-[13px]">
      <ul className="flex flex-row items-center justify-center gap-[60px] w-full">
        <li>
          <NavLink
            href="/"
            textColor="text-black"
            underlineColor="bg-black"
            fontSize="text-[16px]"
            fontWeight="normal"
            isActive={pathname === '/'}
          >
            <Text
              type="small"
              as="p"
              fontWeight="normal"
              className="text-black"
            >
              Home
            </Text>
          </NavLink>
        </li>
        <li>
          <NavLink
            href="/article"
            textColor="text-black"
            underlineColor="bg-black"
            isActive={pathname === '/article'}
          >
            <Text
              type="small"
              as="p"
              fontWeight="normal"
              className="text-black"
            >
              Article
            </Text>
          </NavLink>
        </li>
        <li>
          <NavLink
            href="/about"
            textColor="text-black"
            underlineColor="bg-black"
            isActive={pathname === '/about'}
          >
            <Text
              type="small"
              as="p"
              fontWeight="normal"
              className="text-black"
            >
              About
            </Text>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
