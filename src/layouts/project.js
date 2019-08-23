import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout";
import ProjectHeader from "../components/ProjectHeader";

export const query = graphql`
  query ProjectQuery($slug: String!) {
    project: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        excerpt
        color
        excerpt
        type
        logo {
          publicURL
        }
      }
    }
  }
`;

const Project = ({ data }) => (
  <Layout>
    <article>
      <ProjectHeader project={data.project} />
      <br />
      <p className="text-lg flex">More info coming soon...</p>
    </article>
  </Layout>
);

export default Project;