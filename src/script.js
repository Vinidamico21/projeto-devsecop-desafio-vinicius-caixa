fetch('db.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('db-status').innerText = data.status;

        const list = document.getElementById('task-list');

        data.itens.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item.task;
            list.appendChild(li);
        });
    })
    .catch(err => {
        document.getElementById('db-status').innerText =
            'Erro interno: ' + err.message;
    });

function addTask() {
    const input = document.getElementById('new-task');
    const output = document.getElementById('output');

    const task = document.createElement('li');
    task.innerText = input.value;
    output.appendChild(task);

    console.log('Tarefa adicionada:', input.value);

    input.value = '';
}
