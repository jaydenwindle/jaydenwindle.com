import React from "react";
import PropTypes from "prop-types";
import { graphql, useStaticQuery } from "gatsby";

import Header from "./header";

function Layout({ children }) {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          twitter
          github
          linkedin
        }
      }
    }
  `);

  return (
    <div className="flex flex-col font-sans min-h-screen text-gray-900">
      <Header siteTitle={data.site.siteMetadata.title} />

      <main className="max-w-4xl mx-auto px-4 py-8 md:p-8 w-full">
        {children}
      </main>

      <footer>
        <nav className="flex flex-col justify-between max-w-4xl mt-8 mx-auto p-4 md:p-8 text-sm sm:flex-row">
          <p className="mb-2">
            &copy; {new Date().getFullYear()}. Made with ❤and ☕️
          </p>
          <p>
            <a
              href={data.site.siteMetadata.twitter}
              className="font-bold no-underline"
            >
              Twitter
            </a>
            <a
              href={data.site.siteMetadata.github}
              className="font-bold no-underline ml-4"
            >
              GitHub
            </a>
            <a
              href={data.site.siteMetadata.linkedin}
              className="font-bold no-underline ml-4"
            >
              Linkedin
            </a>
          </p>
        </nav>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
