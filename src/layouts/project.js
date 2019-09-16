import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout";
import ProjectHeader from "../components/ProjectHeader";
import SubscribeForm from "../components/SubscribeForm";

export const query = graphql`
  query ProjectQuery($slug: String!) {
    project: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
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
      <div
        className="text-xl mb-24"
        dangerouslySetInnerHTML={{ __html: data.project.html }}
      />
    </article>
    <SubscribeForm />
  </Layout>
);

export default Project;
