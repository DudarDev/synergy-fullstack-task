import { useEffect, useState } from 'react';
import { api } from './api';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні постів:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Видалити цей пост?')) return;
    try {
      await api.delete(`/posts/${id}`); // Реальний запит
      setPosts(posts.filter(post => post.id !== id));
      alert('Пост видалено!');
    } catch (error) {
      alert('Помилка при видаленні');
    }
  };

  const handleEdit = async (id: number, currentTitle: string) => {
    const newTitle = window.prompt("Введіть новий заголовок:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;

    try {
      await api.put(`/posts/${id}?title=${newTitle}`); // Реальний запит
      setPosts(posts.map(p => p.id === id ? { ...p, title: newTitle } : p));
    } catch (error) {
      alert('Помилка при редагуванні');
    }
  };

  return (
    <div>
      <h2>Список постів</h2>
      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#f8f9fa' }}>
          <tr>
            <th>ID</th>
            <th>Заголовок</th>
            <th>Текст</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr><td colSpan={4}>Немає даних.</td></tr>
          ) : (
            posts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.body.substring(0, 50)}...</td>
                <td>
                  <button onClick={() => handleEdit(post.id, post.title)} style={{ marginRight: '10px', cursor: 'pointer' }}>Редагувати</button>
                  <button onClick={() => handleDelete(post.id)} style={{ color: 'red', cursor: 'pointer' }}>Видалити</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}