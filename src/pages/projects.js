import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ProjectCard from "../components/ProjectCard";
import PostCard from "../components/PostCard";
import SubscribeForm from "../components/SubscribeForm";

export const query = graphql`
  query ProjectsQuery {
    projects: allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___order] }
      filter: {
        frontmatter: { collection: { eq: "projects" }, published: { eq: true } }
      }
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
  }
`;

function IndexPage({ data }) {
  return (
    <Layout>
      <SEO
        title="Projects | Jayden Windle"
        keywords={[
          `projects`,
          `Jayden Windle`,
          `software`,
          `software engineer`
        ]}
      />

      <section className="mb-24">
        <div className="flex flex-row flex-between mb-8">
          <h1 className="text-4xl font-bold inline-block flex-grow">
            Projects
          </h1>
        </div>
        <div className="flex flex-wrap -mx-2">
          {data.projects.nodes.map((project, index) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </section>

      <SubscribeForm />
    </Layout>
  );
}

export default IndexPage;
