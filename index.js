const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const FILE_PATH = './tasks.json';
app.use(express.json());

// ⬇️ Tu dodajemy obsługę folderu public
app.use(express.static(path.join(__dirname, 'public')));

// ===== ENDPOINTY =====

function loadTasksFromFile() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasksToFile(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

app.get('/tasks', (req, res) => {
  const tasks = loadTasksFromFile();
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const tasks = loadTasksFromFile();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    done: false,
  };
  tasks.push(newTask);
  saveTasksToFile(tasks);
  res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const tasks = loadTasksFromFile();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, req.body);
    saveTasksToFile(tasks);
    res.json(task);
  } else {
    res.status(404).json({ error: 'Nie znaleziono zadania' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  let tasks = loadTasksFromFile();
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasksToFile(tasks);
  res.status(204).end();
});

// Start serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
