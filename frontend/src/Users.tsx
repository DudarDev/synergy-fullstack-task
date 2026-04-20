import { useEffect, useState } from 'react';
import { api } from './api';

// Виправляємо на змінні так, як їх віддає Python (з підкресленнями)
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні користувачів:', error);
    }
  };

  const handleSort = () => {
    const sorted = [...users].sort((a, b) => {
      // Тут теж використовуємо first_name
      if (sortOrder === 'asc') {
        return a.first_name.localeCompare(b.first_name);
      } else {
        return b.first_name.localeCompare(a.first_name);
      }
    });
    setUsers(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      alert('Користувача видалено!');
    } catch (error) {
      alert('Помилка при видаленні (можливо у нього є пости).');
    }
  };

  const handleEdit = async (id: number, currentName: string) => {
    const newName = window.prompt("Введіть нове ім'я:", currentName);
    if (!newName || newName === currentName) return;

    try {
      await api.put(`/users/${id}?first_name=${newName}`);
      // Оновлюємо first_name локально
      setUsers(users.map(u => u.id === id ? { ...u, first_name: newName } : u));
    } catch (error) {
      alert('Помилка при редагуванні');
    }
  };

  return (
    <div>
      <h2>Список користувачів</h2>
      
      <button 
        onClick={handleSort}
        style={{ marginBottom: '15px', padding: '8px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Сортувати за ім'ям ({sortOrder === 'asc' ? 'А-Я' : 'Я-А'})
      </button>

      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#f8f9fa' }}>
          <tr>
            <th>ID</th>
            <th>Ім'я</th>
            <th>Прізвище</th>
            <th>Email</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={5}>Немає даних. Натисніть "Завантажити дані з DummyJSON" вище.</td></tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>  {/* Виводимо first_name */}
                <td>{user.last_name}</td>   {/* Виводимо last_name */}
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEdit(user.id, user.first_name)} style={{ marginRight: '10px', cursor: 'pointer' }}>Редагувати</button>
                  <button onClick={() => handleDelete(user.id)} style={{ color: 'red', cursor: 'pointer' }}>Видалити</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}