const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const btnAdd = document.querySelector('#btnAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');

renderTime();
renderTasks();

form.addEventListener('submit', e => {
  e.preventDefault();
  if(itTask.value != ''){
    createTask(itTask.value);
    itTask.value = '';
    renderTasks();
  }
})

function createTask(value){
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(3),
    title: value,
    completed: false
  };
  
  tasks.unshift(newTask);
}

function renderTasks() {
  const html = tasks.map((task) => {
    return `
      <div class="task">
        <div class="title">${task.title}</div>
        <div class="completed">${
          task.completed 
          ? `<span class="done">Finalizado</span>`
          : `<button class="start-button" data-id="${task.id}">Iniciar</button>`}
        </div>
      </div>
    `;
  });

  const tasksContainer = document.querySelector('#tasks');
  tasksContainer.innerHTML = html.join('');

  const btnStart = document.querySelectorAll('.task .start-button');

  btnStart.forEach(button => {
    button.addEventListener('click', e => {
      if(!timer){
        const id = button.getAttribute('data-id');
        btnStartHandler(id);
        button.textContent = 'En progreso'
      }
    });
  });
}

function btnStartHandler(id){
  time = 25 * 60;
  current = id;
  const taskIndex = tasks.findIndex(task => task.id === id);

  taskName.textContent = tasks[taskIndex].title; 
  renderTime();
  timer = setInterval(() => {
    timeHandler(id);
  }, 1000);
}

function timeHandler(id) {
  time --; 
  renderTime();

  if(time === 0){
    clearInterval(timer);
    markCompleted(id);
    timer = null;
    renderTasks();
    startBreak();
  }
}

function startBreak(){
  time = 5 * 60;
  taskName.textContent = 'Break';
  renderTime();
  timerBreak = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler(){
  time--;
  renderTime();

  if(time === 0){
    clearInterval(timerBreak);
    current = null;
    timerBreak = null;
    taskName.textContent = 'Inicie otra actividad 😊';
    renderTasks();
  }
}

function renderTime(){
  const timeDiv = document.querySelector('#time #value');
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function markCompleted(id){
  const taskIndex = tasks.findIndex((task) => task.id === id);
  tasks[taskIndex].completed = true;
}
