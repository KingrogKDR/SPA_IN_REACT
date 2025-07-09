import { Input } from "./ui/Input";

interface NavbarProps {
  search: string;
  setSearch: (s: string) => void;
}

const Navbar = ({ search, setSearch }: NavbarProps) => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl">Search by name, email or body</h1>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus:ring-1 focus:ring-gray-500 px-6 py-4 w-48 md:w-[30rem] transition duration-500 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default Navbar;
