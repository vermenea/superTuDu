import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from './util/https';
import Todo from './Todo';

function App() {
	const { data: todos, refetch } = useQuery({
		queryKey: ['todos'],
		queryFn: () => fetchTodo(),
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

			refetch();
			return addedTodo;
		} catch (error) {
			console.error('Error adding todo:', error);

			return null;
		}
	}
	if (!todos) return <p>Loading...</p>;
	return <Todo addTodo={handleAddTodo} todos={todos} refetchTodos={refetch} />;
}

export default App;
