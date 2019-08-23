const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const postLayout = path.resolve(`./src/layouts/post.js`);
  const postResults = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { frontmatter: { collection: { eq: "posts" } } }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  );

  if (postResults.errors) {
    throw postResults.errors;
  }

  // Create project pages.
  const posts = postResults.data.allMarkdownRemark.edges;

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: `posts${post.node.fields.slug}`,
      component: postLayout,
      context: {
        slug: post.node.fields.slug,
        previous,
        next
      }
    });
  });

  const projectLayout = path.resolve(`./src/layouts/project.js`);
  const projectResults = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { frontmatter: { collection: { eq: "projects" } } }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  );

  if (projectResults.errors) {
    throw projectResults.errors;
  }

  // Create blog posts pages.
  const projects = projectResults.data.allMarkdownRemark.edges;

  projects.forEach((project, index) => {
    const previous =
      index === projects.length - 1 ? null : projects[index + 1].node;
    const next = index === 0 ? null : projects[index - 1].node;

    createPage({
      path: `projects${project.node.fields.slug}`,
      component: projectLayout,
      context: {
        slug: project.node.fields.slug,
        previous,
        next
      }
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value
    });
  }
};
