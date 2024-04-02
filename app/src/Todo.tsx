import { useState, ChangeEvent } from 'react';


export interface TodoItem {
	idx: string;
	name: string;
    completed: boolean;
}

interface Props {
	addTodo: (newTodo: string, id: string) => Promise<TodoItem>;
	todos: TodoItem[];
	refetchTodos: () => void;
}

export default function Todo({ addTodo, todos, refetchTodos }: Props) {
	const [todo, setTodo] = useState<string>('');

	async function handleAddTodo() {
		if (todo.trim() === '') {
			return;
		}
		try {
			const id = 
			await addTodo(todo, id);
			refetchTodos();
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
				{todos.map((task) => (
					<li key={task.id}>{task.name}</li>
				))}
			</ul>
		</section>
	);
}
