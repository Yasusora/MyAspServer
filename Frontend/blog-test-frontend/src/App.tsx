import React, {useState} from 'react';
import AuthTest from './components/AuthTest';
import ArticlesTest from './components/ArticlesTest';
import ChatTest from './components/ChatTest';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'auth' | 'articles' | 'chat'>('auth');

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🧪 Тестовый интерфейс для ASP.NET блога</h1>
            
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <button 
                    onClick={() => setActiveTab('auth')}
                    style={{ 
                        marginRight: '10px',
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'auth' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'auth' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        cursor: 'pointer'
                    }}
                >
                    🔐 Авторизация
                </button>
                
                <button 
                    onClick={() => setActiveTab('articles')}
                    style={{ 
                        marginRight: '10px',
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'articles' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'articles' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        cursor: 'pointer'
                    }}
                >
                    📝 Статьи
                </button>
                
                <button 
                    onClick={() => setActiveTab('chat')}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'chat' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'chat' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        cursor: 'pointer'
                    }}
                >
                    💬 Чат
                </button>
            </div>

            {activeTab === 'auth' && <AuthTest />}
            {activeTab === 'articles' && <ArticlesTest />}
            {activeTab === 'chat' && <ChatTest />}

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                <h3>Инструкция по тестированию:</h3>
                <ol>
                    <li><strong>Авторизация:</strong> Зарегистрируйте нового пользователя или войдите</li>
                    <li><strong>Статьи:</strong> Создайте несколько статей, посмотрите список, откройте детали</li>
                    <li><strong>Чат:</strong> После авторизации подключитесь к чату. Откройте эту страницу в другом браузере для теста реального общения</li>
                </ol>
                
                <div style={{ marginTop: '15px' }}>
                    <strong>Текущий статус:</strong>
                    <div>Токен: {localStorage.getItem('token') ? '✅ Присутствует' : '❌ Отсутствует'}</div>
                    <div>Пользователь: {localStorage.getItem('user') ? '✅ Авторизован' : '❌ Не авторизован'}</div>
                </div>
            </div>
        </div>
    );
};

export default App;