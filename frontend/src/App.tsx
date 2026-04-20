import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { api } from './api';
import Users from './Users'; // <--- Імпортуємо наш новий компонент!
import Posts from './Posts';

function App() {
  const handleSync = async () => {
    try {
      alert('Синхронізація почалася... Зачекайте пару секунд.');
      await api.post('/sync');
      alert('Дані успішно завантажені! Перейдіть на вкладку "Користувачі".');
    } catch (error) {
      alert('Помилка синхронізації.');
      console.error(error);
    }
  };

  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Synergy Fullstack Task</h1>
        
        <nav style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>Головна</Link>
          <Link to="/users" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>Користувачі</Link>
          <Link to="/posts" style={{ marginRight: '20px', textDecoration: 'none', color: 'blue' }}>Пости</Link>
          
          <button 
            onClick={handleSync} 
            style={{ background: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            📥 Завантажити дані з DummyJSON
          </button>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<h3>Вітаємо! Виберіть розділ в меню вище.</h3>} />
            <Route path="/users" element={<Users />} />  {/* <--- Виводимо компонент тут */}
            <Route path="/posts" element={<Posts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;