import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  // Backend URL (Render'da çalışan Spring Boot)
  const BACKEND_URL = "https://todo-app-backend-dssw.onrender.com";


  // Backend'den todos'ları getir
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/todos`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Todos yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Yeni todo ekle
  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      try {
        const response = await fetch(`${BACKEND_URL}/todos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTodo, completed: false }),
        });
        
        if (response.ok) {
          setNewTodo('');
          fetchTodos(); // Listeyi yenile
        }
      } catch (error) {
        console.error('Todo eklenirken hata:', error);
      }
    }
  };

  // Todo toggle (tamamlandı/tamamlanmadı)
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/todos/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchTodos(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Todo toggle edilirken hata:', error);
    }
  };

  // Todo sil
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTodos(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Todo silinirken hata:', error);
    }
  };

  // Sayfa yüklendiğinde todos'ları getir
  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Ozgur's To-Do List 🚀</h1>

        
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Yeni görev ekle..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Ekle
          </button>
        </form>

        <div className="todo-list">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="todo-title">{todo.title}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <p className="empty-message">Henüz görev eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}

export default App;
