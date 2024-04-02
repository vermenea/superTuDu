import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from './util/https';
import Todo from './Todo';

function App() {
	const { id } = useParams();
	const todoId = id;

	const { data } = useQuery({
		queryKey: ['todos', todoId],
		queryFn: ({ signal }) => fetchTodo({ signal, id: todoId }),
	});

	async function handleAddTodo(newTodo: string) {
		try {
			const response = await fetch('http://localhost:3000/todos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: newTodo, completed: false }),
			});
			if (!response.ok) {
				throw new Error('Failed to add todo');
			}
			const addedTodo = await response.json();
			return addedTodo;
		} catch (error) {
			console.error('Error adding todo:', error);
		}
	}

	return <Todo addTodo={handleAddTodo} todos={data} />;
}

export default App;
