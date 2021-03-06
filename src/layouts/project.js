import { graphql } from "gatsby";
import React from "react";
import SEO from "../components/seo";

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
    <SEO
      title={`${data.project.frontmatter.title} | Jayden Windle`}
      keywords={[`Jayden Windle`, `software`, `software engineer`]}
    />
    <article>
      <ProjectHeader project={data.project} />
      <br />
      <div
        className="text-xl mb-24 post-content"
        dangerouslySetInnerHTML={{ __html: data.project.html }}
      />
    </article>
    <SubscribeForm />
  </Layout>
);

export default Project;
