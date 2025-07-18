// localhost:9090 portuna GET isteği atan fonksiyon
async function fetchFromBackend(endpoint) {
    try {
        const response = await fetch(`http://localhost:9090${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Backend'e DELETE isteği gönderen fonksiyon
async function deleteFromBackend(endpoint) {
    try {
        const response = await fetch(`http://localhost:9090${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
}

// Backend'e PUT isteği gönderen fonksiyon
async function putToBackend(endpoint) {
    try {
        const response = await fetch(`http://localhost:9090${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Put error:', error);
        throw error;
    }
}

// Backend'den todos'ları alıp HTML'de gösteren fonksiyon
async function loadTodosFromBackend() {
    try {
        const backendTodos = await fetchFromBackend('/todos');
        console.log('Backend\'den gelen todos:', backendTodos);
        
        // HTML'deki todo listesini temizle
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        
        // Her todo için HTML elementi oluştur
        backendTodos.forEach((todo, index) => {
            const div = document.createElement('div');
            div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${todo.id})">
                <span>${todo.title}</span>
                <span class="delete-btn" onclick="deleteTodo(${todo.id})">❌</span>
            `;
            todoList.appendChild(div);
        });
        
        return backendTodos;
    } catch (error) {
        console.error('Todos yüklenirken hata:', error);
        return [];
    }
}

// Todo toggle fonksiyonu - backend'e PUT isteği gönder
async function toggleTodo(id) {
    try {
        await putToBackend(`/todos/${id}/toggle`);
        // Başarılı olursa listeyi yenile
        loadTodosFromBackend();
    } catch (error) {
        console.error('Todo toggle edilirken hata:', error);
    }
}

// Todo silme fonksiyonu - backend'e DELETE isteği gönder
async function deleteTodo(id) {
    try {
        await deleteFromBackend(`/todos/${id}`);
        // Başarılı olursa listeyi yenile
        loadTodosFromBackend();
    } catch (error) {
        console.error('Todo silinirken hata:', error);
    }
}

// Sayfa yüklendiğinde backend'den todos'ları yükle
document.addEventListener('DOMContentLoaded', function() {
    loadTodosFromBackend();
});

// Kullanım örnekleri:
// fetchFromBackend('/todos') - tüm to-do'ları getir
// fetchFromBackend('/users') - tüm kullanıcıları getir
