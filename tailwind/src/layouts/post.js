import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout";

export const query = graphql`
  query PostQuery($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        featuredImage {
          publicURL
        }
        date(formatString: "MMMM Do, YYYY")
      }
    }
  }
`;

const Post = ({ data }) => (
  <Layout>
    <article>
      <div
        style={{
          background: `linear-gradient(
                rgba(0, 0, 0, 0.7), 
                rgba(0, 0, 0, 0.7)
            ),
            url(${data.post.frontmatter.featuredImage.publicURL})`,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
        className="py-32 rounded flex flex-col justify-center items-center mb-16"
      >
        <h1 className="text-5xl font-bold flex text-white px-8">
          {data.post.frontmatter.title}
        </h1>
        <p className="text-lg flex text-white">{data.post.frontmatter.date}</p>
      </div>
      <div
        className="text-xl"
        dangerouslySetInnerHTML={{ __html: data.post.html }}
      />
    </article>
  </Layout>
);

export default Post;
