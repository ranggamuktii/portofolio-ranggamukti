import Navbar from './Navbar';

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center z-40 bg-gradient-to-b from-zinc-900 to-zinc-900/0">
      <div className="max-w-screen-2xl w-full mx-auto px-4 flex justify-center items-center">
        <div className="w-full flex justify-center mt-10">
          <Navbar />
        </div>
      </div>
    </header>
  );
}

export default Header;
