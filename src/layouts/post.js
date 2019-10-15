import { graphql } from "gatsby";
import React from "react";

import Layout from "../components/layout";
import PostHeader from "../components/PostHeader";
import SubscribeForm from "../components/SubscribeForm";

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
        className="text-lg mb-24 post-content"
        dangerouslySetInnerHTML={{ __html: data.post.html }}
      />
    </article>
    <SubscribeForm />
  </Layout>
);

export default Post;
