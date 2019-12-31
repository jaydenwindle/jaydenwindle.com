import React from "react";

const PostHeader = ({ post }) => (
  <div className="mb-16">
    <h1 className="text-5xl font-bold text-center flex mb-16">
      {post.frontmatter.title}
    </h1>
    <img
      alt="blog header"
      className="object-cover object-center rounded flex flex-col justify-center items-center mb-16"
      src={post.frontmatter.featuredImage.publicURL}
    />
  </div>
);

export default PostHeader;
