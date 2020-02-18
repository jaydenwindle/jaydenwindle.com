const feedConfig = {
  serialize: ({ query: { site, allMarkdownRemark } }) => {
    return allMarkdownRemark.edges.map(edge => {
      const url =
        site.siteMetadata.siteUrl + "/writing" + edge.node.fields.slug;
      return Object.assign({}, edge.node.frontmatter, {
        description: edge.node.frontmatter.excerpt,
        date: edge.node.frontmatter.date,
        url,
        guid: url,
        custom_elements: [{ "content:encoded": edge.node.html }]
      });
    });
  },
  query: `
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] },
        filter: {
          frontmatter: { collection: { eq: "posts" }, published: { eq: true } }
        }
      ) {
        edges {
          node {
            html
            fields { slug }
            frontmatter {
              excerpt
              title
              tags
              date
            }
          }
        }
      }
    }
  `,
  output: "/rss.xml",
  title: "Jayden Windle's Blog"
};

module.exports = {
  siteMetadata: {
    title: `Jayden Windle`,
    description: `I’m a product-focused software engineer building world-class apps for mobile, web, and desktop.`,
    siteUrl: "https://jaydenwindle.com",
    author: `@jayden_windle`,
    twitter: "https://twitter.com/jayden_windle",
    github: "https://github.com/jaydenwindle",
    linkedin: "https://www.linkedin.com/in/jayden-windle-79b0bb68/"
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-tailwind`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#212121`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`
      }
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-offline`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/src/posts/`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "projects",
        path: `${__dirname}/src/projects/`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images/`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590
            }
          },
          `gatsby-remark-prismjs`
        ]
      }
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://jaydenwindle.com`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-39259114-2"
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          feedConfig,
          {
            ...feedConfig,
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges
                .filter(edge => edge.node.frontmatter.tags.includes("Django"))
                .map(edge => {
                  const url =
                    site.siteMetadata.siteUrl +
                    "/writing" +
                    edge.node.fields.slug;
                  return Object.assign({}, edge.node.frontmatter, {
                    description: edge.node.frontmatter.excerpt,
                    date: edge.node.frontmatter.date,
                    url,
                    guid: url,
                    custom_elements: [{ "content:encoded": edge.node.html }]
                  });
                });
            },
            output: "/django-rss.xml",
            title: "Jayden Windle's Blog - Django"
          }
        ]
      }
    }
  ]
};
