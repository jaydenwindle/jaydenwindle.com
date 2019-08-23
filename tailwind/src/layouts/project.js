import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout";

export const query = graphql`
  query ProjectQuery($slug: String!) {
    project: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        excerpt
      }
    }
  }
`;

const Project = ({ data }) => (
  <Layout>
    <article>
      <h1 className="text-4xl font-bold flex">
        {data.project.frontmatter.title}
      </h1>
      <p className="text-lg flex">{data.project.frontmatter.excerpt}</p>
      <br />
      <p className="text-lg flex">More info coming soon...</p>
    </article>
  </Layout>
);

export default Project;
