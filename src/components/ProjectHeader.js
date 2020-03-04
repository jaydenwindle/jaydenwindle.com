import React from "react";

const ProjectHeader = ({ project }) => (
  <div
    style={{
      backgroundColor: project.frontmatter.color
    }}
    className="py-32 rounded flex flex-col justify-center items-center mb-16"
  >
    <img
      className="w-20 h-20 mx-auto mb-6 object-contain"
      src={project.frontmatter.logo.publicURL}
      alt={`${project.frontmatter.title} logo`}
    />
    <h1 className="text-5xl font-bold flex text-white px-8">
      {project.frontmatter.title}
    </h1>
    <p className="text-lg flex text-white mb-6">
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
);

export default ProjectHeader;
