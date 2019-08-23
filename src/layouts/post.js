import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout";
import PostHeader from "../components/PostHeader";

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
      <PostHeader post={data.post} />
      <div
        className="text-xl"
        dangerouslySetInnerHTML={{ __html: data.post.html }}
      />
    </article>
  </Layout>
);

export default Post;
