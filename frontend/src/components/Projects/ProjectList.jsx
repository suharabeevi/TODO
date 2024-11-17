import ProjectCard from "./ProjectCard";
import "../../styles/ProjectList.css";
function ProjectList() {
  const projects = [
    { id: 1, title: "Project 1", date: "2024-11-01" },
    { id: 2, title: "Project 2", date: "2024-11-02" },
  ];

  return (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;
