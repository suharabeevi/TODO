import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ProjectCard.css";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div className="project-card" onClick={() => navigate(`/project/${project.id}`)}>
      <h3>{project.title}</h3>
      <p>Created: {project.date}</p>
    </div>
  );
}

export default ProjectCard;


