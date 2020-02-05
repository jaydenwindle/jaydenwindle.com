import { Link } from "gatsby";
import React from "react";

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects${project.fields.slug}`}
      className="w-full md:w-1/3 px-2 mb-8 md:mb-4"
    >
      <div
        className="rounded overflow-hidden hover:shadow-lg transition px-8 py-8 min-h-full flex flex-col justify-between"
        style={{
          backgroundColor: project.frontmatter.color
        }}
      >
        <img
          className="w-20 h-20 mx-auto mb-6 object-contain"
          src={project.frontmatter.logo.publicURL}
          alt={`${project.frontmatter.title} logo`}
        />
        <div className="font-bold text-xl text-white text-center mb-6">
          {project.frontmatter.title}
        </div>
        <p className="text-base text-white text-center mb-6">
          {project.frontmatter.excerpt}
        </p>
        <div className="flex justify-center">
          <span
            className="inline-block bg-white rounded-full px-3 py-1 text-sm font-semibold"
            style={{ color: project.frontmatter.color }}
          >
            {project.frontmatter.type}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
