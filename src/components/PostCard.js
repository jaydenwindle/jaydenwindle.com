import { Link } from "gatsby";
import React from "react";

function PostCard({ post }) {
  console.log(post);
  return (
    <Link
      key={post.id}
      to={`/writing${post.fields.slug}`}
      className="rounded overflow-hidden mb-8 flex flex-col md:w-1/2 lg:w-full lg:flex-row"
    >
      <img
        className="w-full lg:w-1/3 object-cover rounded"
        src={post.frontmatter.featuredImage.publicURL}
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4 flex flex-col justify-between">
        <div className="font-bold text-xl hover:text-blue-500">
          {post.frontmatter.title}
        </div>
        <p className="text-gray-700 text-base">{post.frontmatter.excerpt}</p>
        <div>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-1 hover:bg-blue-500 hover:text-white">
            Read More
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
