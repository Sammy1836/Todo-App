const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const port = 3001;

app.use(bodyParser.json());


function findIndex(arr, id) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            return i;
        }
    }
    return -1;
}

function deleteIndex(arr, index) {
    newarray = [];
    for (i = 0; i < arr.length; i++) {
        if (i != index) {
            newarray.push(arr[i]);
        }
    }
    return newarray;
}


app.get('/todos', (req, res) => {
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    })
})

app.get('/listTodos', (req, res) => {
    res.sendFile(path.join(__dirname, 'todos.html'));
})

app.post('/todos', (req, res) => {
    const time = new Date().getTime();
    const newTodo = {
        id: time % 1000,
        title: req.body.title,
        description: req.body.description
    };
    fs.readFile("todos.json", 'utf-8', (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        todos.push(newTodo);
        fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
            if (err) throw err;
            res.status(201).json(newTodo);
        })
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.delete('/todos/:id', (req, res) => {

    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) throw err;
        todos = JSON.parse(data);
        todoIndex = findIndex(todos, parseInt(req.params.id));

        if (todoIndex === -1) {
            res.status(404).send();
        }
        else {
            todos = deleteIndex(todos, todoIndex);
            fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                if (err) throw err;
                res.status(200).send();
            })
        }
    })
})

app.use((req, res, next) => {
    res.status(404).send();
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

