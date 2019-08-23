import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ProjectCard from "../components/ProjectCard";
import PostCard from "../components/PostCard";
import SubscribeForm from "../components/SubscribeForm";

export const query = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        twitter
        github
        linkedin
        description
      }
    }
    projects: allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___order] }
      filter: { frontmatter: { collection: { eq: "projects" } } }
    ) {
      nodes {
        id
        frontmatter {
          title
          excerpt
          type
          color
          logo {
            publicURL
          }
        }
        fields {
          slug
        }
      }
    }
    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { collection: { eq: "posts" } } }
    ) {
      nodes {
        id
        frontmatter {
          title
          date
          excerpt
          featuredImage {
            publicURL
          }
        }
        fields {
          slug
        }
        html
      }
    }
  }
`;

function IndexPage({ data }) {
  return (
    <Layout>
      <SEO
        title="Home"
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
      />

      <section className="text-left mb-24">
        <h2 className="text-5xl font-bold inline-block my-8 lg:w-2/3">
          Hello World! <br /> I'm Jayden Windle
        </h2>

        <p className="text-xl lg:w-2/3 mb-8">
          {data.site.siteMetadata.description}
        </p>
        <div>
          <a
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-1 hover:bg-gray-300 font-bold no-underline mr-4"
            href={data.site.siteMetadata.twitter}
          >
            Twitter
          </a>
          <a
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-1 hover:bg-gray-300 font-bold no-underline mr-4"
            href={data.site.siteMetadata.github}
          >
            Github
          </a>
          <a
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mb-1 hover:bg-gray-300 font-bold no-underline mr-4"
            href={data.site.siteMetadata.linkedin}
          >
            Linkedin
          </a>
        </div>
      </section>

      <section className="mb-24">
        <div className="flex flex-row flex-between mb-8">
          <h3 className="text-3xl font-bold inline-block flex-grow">
            Projects
          </h3>
          <Link to="/projects">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded flex flex-row">
              See all
            </button>
          </Link>
        </div>
        <div className="flex flex-wrap -mx-2">
          {data.projects.nodes.map((project, index) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </section>

      <section className="mb-24">
        <div className="flex flex-row flex-between mb-8">
          <h3 className="text-3xl font-bold inline-block flex-grow">Writing</h3>
          <Link to="/writing">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
              See all
            </button>
          </Link>
        </div>
        <div>
          {data.posts.nodes.map(post => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </section>

      <SubscribeForm />
    </Layout>
  );
}

export default IndexPage;
