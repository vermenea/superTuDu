import { useState, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface TodoItem {
    id: string;
    name: string;
}

interface Props {
    addTodo: (newTodo: string, id: string) => Promise<TodoItem>;
	todos: [];
}

export default function Todo({ addTodo }: Props) {
    const [todo, setTodo] = useState<string>('');
    const [todos, setTodos] = useState<TodoItem[]>([]);

    async function handleAddTodo() {
        if (todo.trim() === '') {
            return;
        }
        try {
            const id = uuidv4();
            const response = await addTodo(todo, id);
            setTodos([...todos, response]);
            setTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    function handleTodoChange(e: ChangeEvent<HTMLInputElement>): void {
        setTodo(e.target.value);
    }

    return (
        <section className='container'>
            <header>
                <h1>SuperTuDu</h1>
            </header>
            <div className='todos'>
                <input
                    type='text'
                    value={todo}
                    onChange={handleTodoChange}
                    placeholder='Enter Todo'
                />
                <button onClick={handleAddTodo}>Add</button>
            </div>
            <ul className='list'>
                {todos.map(task => (
                    <li key={task.id}>{task.name}</li>
                ))}
            </ul>
        </section>
    );
}
