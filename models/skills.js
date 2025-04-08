const mongoose = require("mongoose");

const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}`;

const SkillSchema = new mongoose.Schema({
  name: String,
  level: String,  
  category: String 
});
const Skill = mongoose.model("Skill", SkillSchema);

async function connect() {
  await mongoose.connect(dbUrl);
}

async function initializeSkills() {
  await connect();
  const count = await Skill.countDocuments();
  if (count === 0) {
    console.log("No skills found, please inserting real data...");
    let skillList = [
      { name: "HTML", level: "Advanced", category: "Frontend" },
      { name: "CSS", level: "Advanced", category: "Frontend" },
      { name: "JavaScript", level: "Advanced", category: "Frontend" },
      { name: "React", level: "Intermediate", category: "Frontend" },
      { name: "Node.js", level: "Intermediate", category: "Backend" },
      { name: "MongoDB", level: "Intermediate", category: "Backend" },
      { name: "Figma", level: "Advanced", category: "Design" },
      { name: "Adobe XD", level: "Intermediate", category: "Design" }
    ];
    await Skill.insertMany(skillList);
    console.log("Portfolio skills added.");
  }
}

async function getSkills() {
  await connect();
  return await Skill.find({});
}

async function addSkill(name, level, category) {
  await connect();
  let newSkill = new Skill({ name, level, category });
  await newSkill.save();
}

async function updateSkillCategory(name, newCategory) {
  await connect();
  await Skill.updateOne({ name }, { category: newCategory });
}

async function deleteSkillsByName(name) {
  await connect();
  await Skill.deleteMany({ name });
}

module.exports = { 
  getSkills,
  initializeSkills,
  addSkill,
  updateSkillCategory,
  deleteSkillsByName
};