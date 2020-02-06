import { graphql } from "gatsby";
import React from "react";
import SEO from "../components/seo";

import Layout from "../components/layout";
import PostHeader from "../components/PostHeader";
import SubscribeForm from "../components/SubscribeForm";

export const query = graphql`
  query PostQuery($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        excerpt
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
    <SEO
      title={`${data.post.frontmatter.title}`}
      keywords={[`Jayden Windle`, `software`, `software engineer`]}
      description={data.post.frontmatter.excerpt}
    />
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
