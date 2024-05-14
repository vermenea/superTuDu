import { useState, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from './util/https';
import { Container } from './style/Container';

export interface TodoItem {
	idx: string;
	name: string;
	completed: boolean;
}

interface Props {
	addTodo: (newTodo: string, id: string) => Promise<TodoItem>;
	deleteTodo: (idx: string) => Promise<void>;
	markTodo: (idx: string, completed: boolean) => Promise<void>;
	todos: TodoItem[];
	refetchTodos: () => void;
}

export default function Todo({ addTodo, deleteTodo, markTodo }: Props) {
	const [todo, setTodo] = useState<string>('');
	const { data: todos, refetch } = useQuery({
		queryKey: ['todos'],
		queryFn: () => fetchTodo(),
	});

	async function handleAddTodo() {
		if (todo.trim() === '') {
			return;
		}
		try {
			const id = uuidv4();
			await addTodo(todo, id);
			refetch();
			setTodo('');
		} catch (error) {
			console.error('Error adding todo:', error);
		}
	}

	async function handleDeleteTodo(idx: string) {
		try {
			await deleteTodo(idx);
			refetch();
		} catch (error) {
			console.error('Error deleting todo:', error);
		}
	}

	async function handleMarkCompletedTodo(idx: string, completed: boolean) {
		try {
			await markTodo(idx, completed);
			refetch();
		} catch (error) {
			console.error('Error marking todo', error);
		}
	}

	function handleTodoChange(e: ChangeEvent<HTMLInputElement>): void {
		setTodo(e.target.value);
	}

	function handleCheckboxChange(idx: string, checked: boolean) {
		handleMarkCompletedTodo(idx, checked);
	}

	return (
		<Container>
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
				{todos.map((task: TodoItem) => (
					<div className='todo-box' key={task.idx}>
						<li className='todo'>
							<p>{task.name}</p>
							{task.completed}
							<div className='buttons-box'>
								<button onClick={() => handleDeleteTodo(task.idx)}>
									delete
								</button>
								<input
									type='checkbox'
									checked={task.completed}
									onChange={(e) => {
										handleCheckboxChange(task.idx, e.target.checked);
									}}
								/>
							</div>
						</li>
					</div>
				))}
			</ul>
		</Container>
	);
}
