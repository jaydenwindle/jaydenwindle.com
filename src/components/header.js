import { Link } from "gatsby";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { ExternalLink } from "react-feather";

import logo from "../images/logo.png";

function Header({ siteTitle }) {
  const [isExpanded, toggleExpansion] = useState(false);

  return (
    <nav className="">
      <div className="flex flex-wrap items-center justify-between max-w-4xl mx-auto p-4 md:p-8">
        <Link to="/" className="flex items-center no-underline">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 rounded-full hover:shadow"
          />
        </Link>

        <button
          className="block md:hidden border border-white flex items-center px-3 py-2 rounded"
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>

        <div
          className={`${
            isExpanded ? `block` : `hidden`
          } md:block md:flex md:items-center w-full md:w-auto`}
        >
          <div className="text-sm">
            <Link
              to="/writing"
              className="block md:inline-block mt-4 md:mt-0 no-underline hover:underline"
            >
              Writing
            </Link>
          </div>
          <div className="text-sm md:ml-6">
            <Link
              to="/projects"
              className="block md:inline-block mt-4 md:mt-0 no-underline hover:underline"
            >
              Projects
            </Link>
          </div>
          <div className="text-sm md:ml-6 flex flex-row items-center">
            <a
              href="https://jaydenwindle.podia.com/"
              className="block md:inline-block mt-4 md:mt-0 no-underline hover:underline"
            >
              Courses
            </a>
            <ExternalLink size={14} className="ml-1 mt-4 md:mt-0" />
          </div>
          <div className="text-sm md:ml-6 flex flex-row items-center">
            <Link
              to="/contact"
              className="block md:inline-block mt-4 md:mt-0 no-underline hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

Header.propTypes = {
  siteTitle: PropTypes.string
};

Header.defaultProps = {
  siteTitle: ``
};

export default Header;
