import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import PostCard from "../components/PostCard";
import SubscribeForm from "../components/SubscribeForm";

export const query = graphql`
  query PostsQuery {
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
        title="Writing | Jayden Windle"
        keywords={[`writing`, `Jayden Windle`, `software`, `software engineer`]}
      />

      <section className="mb-24">
        <div className="flex flex-row flex-between mb-8">
          <h3 className="text-4xl font-bold inline-block flex-grow">Writing</h3>
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
