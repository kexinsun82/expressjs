const mongoose = require("mongoose");

const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}`;

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  tech: [String],
  year: Number,
  status: String,
  url: String,
  order: { type: Number, default: 0 },
  imageUrl: String 
});
const Project = mongoose.model("Project", ProjectSchema);

async function connect() {
  await mongoose.connect(dbUrl);
}

async function initializeProjects() {
  await connect();
  const count = await Project.countDocuments();
  if (count === 0) {
    console.log("No projects found, please inserting portfolio data...");
    let projectList = [
      {
        name: "Focus Typing",
        description: "A typing speed test web app to help users improve typing skills.",
        tech: ["JavaScript", "React", "Node.js"],
        year: 2025,
        status: "Completed",
        url: "https://kexinsun82.github.io/javascript-focus-typing/",
        imageUrl: "https://i.postimg.cc/Vv5yZmTq/project2.png" 
      },
      {
        name: "Portfolio Website",
        description: "My personal portfolio showcasing my projects and skills.",
        tech: ["HTML", "CSS", "JavaScript", "Express"],
        year: 2025,
        status: "In Progress",
        url: "https://www.kellysun.ca/",
        imageUrl: "https://i.postimg.cc/hPkFMF0m/project6.png" 
      }
    ];
    await Project.insertMany(projectList);
    console.log("Portfolio projects added.");
  }
}

async function getProjects() {
  await connect();
  const projects = await Project.find().sort({ order: 1 });
  return projects;
}

async function addProject(name, description, tech, year, status, url, imageUrl) {
  await connect();
  let newProject = new Project({ name, description, tech, year, status, url, imageUrl });
  await newProject.save();
}

async function updateProjectStatus(name, newStatus) {
  await connect();
  await Project.updateOne(
    { name: name }, 
    { status: newStatus }
  );
}

async function deleteProjectsByName(name) {
  await connect();
  let result = await Project.deleteMany({ name: name });
}

async function updateProjectOrder(name, newOrder) {
  await connect();
  await Project.updateOne(
    { name: name },
    { $set: { order: newOrder } }
  );
}

module.exports = { 
  getProjects,
  initializeProjects,
  addProject,
  updateProjectStatus,
  deleteProjectsByName,
  updateProjectOrder
};