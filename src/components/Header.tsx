import Image from 'next/image';

const Header = () => {
  const date = new Date();
  const today = date.toLocaleDateString('bn-BD', {
    dateStyle: 'full',
  });

  return (
    <header className="bg-white border-t-4 border-green-600 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          
                   <div className="bg-green-600 p-2 rounded-xl flex items-center justify-center shadow-sm">
            <Image
              src="/images/logo-icon.png"
              alt="বাজার দর Logo"
              width={35}
              height={35}
              className="object-contain inverted-or-white-version" 
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800">বাজার দর</h1>
            <p className="text-xs text-gray-500">{today}</p>
          </div>
        </div>

        {/* Sign In / Sign Up */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">
            সাইন ইন
          </button>
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm">
            সাইন আপ
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
