const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const ProjectDB = require("./models/projects"); 
const SkillDB = require("./models/skills"); 

const app = express();
const port = process.env.PORT || "3306";

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

ProjectDB.initializeProjects();
SkillDB.initializeSkills();

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await ProjectDB.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/addproject", async (req, res) => {
  try {
    const { name, description, tech, year, status, url } = req.body;
    await ProjectDB.addProject(name, description, tech.split(","), parseInt(year), status, url);
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:name", async (req, res) => {
  try {
    await ProjectDB.deleteProjectsByName(req.params.name);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/skills", async (req, res) => {
  try {
    const skills = await SkillDB.getSkills();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/skills", async (req, res) => {
  try {
    const { name, level, category } = req.body;
    await SkillDB.addSkill(name, level, category);
    res.status(201).json({ message: "Skill created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/skills/:name", async (req, res) => {
  try {
    await SkillDB.deleteSkillsByName(req.params.name);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/updateprojectstatus', async (req, res) => {
  try {
    const { name, newStatus } = req.body;
    await ProjectDB.updateProjectStatus(name, newStatus);
    res.redirect('/projects'); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", async (req, res) => {
  let projectList = await ProjectDB.getProjects();
  let skillList = await SkillDB.getSkills();
  res.render("index", { projects: projectList, skills: skillList });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});