import react from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

const Header = () => {
  return (
    <Menu>
      <Menu.Item>
        <Link href="/">Home</Link>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Link href="/">Campaigns</Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/campaigns/new">+</Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};
Header.displayName = "Header";
export default Header;
