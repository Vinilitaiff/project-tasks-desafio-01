const express = require("express");

const server = express();

server.use(express.json());

Number((numberOfRequests = 0));
const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.json({ error: "projeto nao existe" });
  }

  return next();
}

function LogRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(LogRequests);

//listar
server.get("/projects", (req, res) => {
  return res.json({ projects });
});
//adicionar
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  projects.splice(project, 1);

  return res.json({
    ok: `Projeto (${project.title}) removido com sucesso`
  });
});

//adicionar tasks
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { titleTasks } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(titleTasks);

  return res.json({
    ok: `Tasks adiciondo no project (${project.title}) com sucesso`
  });
});

server.listen(3000);
