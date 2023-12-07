import { Link, NavLink } from '@remix-run/react';
// import CodeIcon from '@mui/icons-material/Code';

export default function Nav() {
  const activeClassName = "bg-theme-nav-clickable-active text-theme-nav-clickable-text-active hover:text-theme-nav-clickable-text-hover px-3 py-2 rounded-md text-sm font-sans";
  const inactiveClassName = "text-theme-nav-clickable-text hover:bg-theme-nav-clickable-hover hover:text-theme-nav-clickable-text px-3 py-2 rounded-md text-sm font-sans";
  return (
    <nav className="bg-theme-primary-dark">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <div className="flex">
                  {/* <svg className="w-6 h-6 mr-2 text-theme-clickable stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                  </svg> */}
                  <span className="font-sans text-theme-clickable">Patrick Rush</span>
                </div>
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline">
                  <NavLink to="/about-me" className={({isActive}) =>
                    isActive ? activeClassName : inactiveClassName
                  }
                   >About Me</NavLink>
                  <NavLink to="/projects" className={({isActive}) =>
                    isActive ? activeClassName : inactiveClassName
                  }>Projects</NavLink>
                  <NavLink to="/resume" className={({isActive}) =>
                    isActive ? activeClassName : inactiveClassName
                  }>Resume</NavLink>
                  <NavLink to="/contact" className={({isActive}) =>
                    isActive ? activeClassName : inactiveClassName
                  }>Contact</NavLink>
                </div>
              </div>
            </div>
            {/* <div className="flex items-center p-1">
              <div className="flex-shrink-0 mx-1 md:mx-0 lg:mx-0">
                  <Link
                    to="newReservation"
                    className="relative inline-flex items-center rounded-md border border-transparent bg-theme-clickable px-4 py-2 text-sm font-medium text-theme-clickable-text shadow-sm hover:bg-theme-clickable-hover "
                  >
                    + New Booking
                  </Link>
              </div>
              <div className="hidden md:block">
                <div className="md:m-4 ml-2 flex justify-around items-center md:ml-4">
                  <button type="button" className="rounded-full bg-theme-gray-dark p-1 text-theme-gray-light hover:text-theme-white ">
                    <span className="sr-only">Got a question?</span>
                    <svg className="stroke-[1.5px] w-6 h-6 text-theme-gray-light hover:text-theme-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mr-2 flex md:hidden">
                <div className="ml-2 md:ml-3">
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </nav>
  )
};