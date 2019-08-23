import React from "react";

const PostHeader = ({ post }) => (
  <div
    style={{
      background: `linear-gradient(
                rgba(0, 0, 0, 0.7), 
                rgba(0, 0, 0, 0.7)
            ),
            url(${post.frontmatter.featuredImage.publicURL})`,
      backgroundPosition: "center",
      backgroundSize: "cover"
    }}
    className="py-32 rounded flex flex-col justify-center items-center mb-16"
  >
    <h1 className="text-5xl font-bold flex text-white px-8">
      {post.frontmatter.title}
    </h1>
    <p className="text-lg flex text-white">{post.frontmatter.date}</p>
  </div>
);

export default PostHeader;
