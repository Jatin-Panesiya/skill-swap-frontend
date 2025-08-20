import { Link } from "react-router";

const Header = () => {
  return (
    <div className="md:w-full w-[calc(100vw-100px)]">
      <div className="flex items-center w-full gap-5 justify-between">
        <Link to="/dashboard" className="cursor-pointer text-2xl font-bold">
          Skill Swap
        </Link>
      </div>
    </div>
  );
};

export default Header;
