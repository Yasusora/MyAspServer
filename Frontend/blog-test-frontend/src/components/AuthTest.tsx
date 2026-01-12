import React, { useState } from 'react';
import agent from '../api/agent';

const AuthTest: React.FC = () => {
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('Password123!');
    const [displayName, setDisplayName] = useState('Test User');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const getErrorMessage = (err: any): string => {
        if (!err.response) {
            return 'Нет связи с сервером';
        }
        
        const data = err.response.data;
        
        if (typeof data === 'string') {
            return data;
        }
        
        if (data && typeof data === 'object' && data.message) {
            return data.message;
        }
        
        if (data && typeof data === 'object' && data.title) {
            return data.title;
        }
        
        if (data && typeof data === 'object' && Array.isArray(data.errors)) {
            const errorMessages: string[] = [];
            Object.values(data.errors).forEach((errorArray: any) => {
                if (Array.isArray(errorArray)) {
                    errorArray.forEach((msg: string) => errorMessages.push(msg));
                }
            });
            return errorMessages.join(', ');
        }
        
        if (data && typeof data === 'object') {
            try {
                return JSON.stringify(data);
            } catch {
                return 'Неизвестная ошибка';
            }
        }
        
        return 'Неизвестная ошибка';
    };

    // 1. Кнопка "Войти"
    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const user = await agent.Account.login(email, password);
            setResult(user);
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Вход успешен:', user.email);
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setResult(null);
            console.error('Ошибка входа:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Кнопка "Регистрация" - использует введенные данные
    const handleRegister = async () => {
    // Проверяем введенные данные
    if (!email.trim()) {
        setError('Введите email');
        return;
    }
    if (!displayName.trim()) {
        setError('Введите имя');
        return;
    }
    if (!password.trim()) {
        setError('Введите пароль');
        return;
    }
    
    setLoading(true);
    setError('');
    try {
        // Используем введенные пользователем данные
        const user = await agent.Account.register(displayName, email, password);
        setResult(user);
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Регистрация успешна:', user.email);
    } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setResult(null);
        
        // ТОЛЬКО сообщаем об ошибке, НЕ меняем email!
        // Убрали setEmail() - оставляем то, что ввел пользователь
    } finally {
        setLoading(false);
    }
};

    // 3. Кнопка "Тестовая регистрация" - генерирует уникальные данные
    const handleTestRegister = async () => {
        const uniqueEmail = `test${Date.now()}@test.com`;
        const testDisplayName = `User${Date.now().toString().slice(-4)}`;
        const testPassword = 'Test123!';
        
        setLoading(true);
        setError('');
        try {
            const user = await agent.Account.register(testDisplayName, uniqueEmail, testPassword);
            setResult(user);
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Обновляем поля формы для удобства
            setEmail(uniqueEmail);
            setDisplayName(testDisplayName);
            setPassword(testPassword);
            
            console.log('Тестовая регистрация успешна:', uniqueEmail);
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setResult(null);
            console.error('Ошибка тестовой регистрации:', err);
        } finally {
            setLoading(false);
        }
    };

    // 4. Кнопка "Текущий пользователь"
    const handleGetCurrent = async () => {
        setLoading(true);
        setError('');
        try {
            const user = await agent.Account.getCurrent();
            setResult(user);
            console.log('Текущий пользователь:', user.email);
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    // 5. Кнопка "Выйти"
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setResult(null);
        setError('');
        console.log('Выполнен выход');
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
            <h2>🔐 Тест авторизации</h2>
            
            <div style={{ marginBottom: '10px' }}>
                <div>
                    <label>Email: </label>
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '300px', marginLeft: '10px' }}
                        placeholder="Введите email"
                        disabled={loading}
                    />
                </div>
                
                <div style={{ marginTop: '5px' }}>
                    <label>Пароль: </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '300px', marginLeft: '10px' }}
                        placeholder="Введите пароль"
                        disabled={loading}
                    />
                </div>
                
                <div style={{ marginTop: '5px' }}>
                    <label>Имя (для регистрации): </label>
                    <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        style={{ width: '300px', marginLeft: '10px' }}
                        placeholder="Введите имя"
                        disabled={loading}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button 
                    onClick={handleLogin} 
                    disabled={loading} 
                    style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white' }}
                >
                    Войти
                </button>
                <button 
                    onClick={handleRegister} 
                    disabled={loading} 
                    style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white' }}
                >
                    Регистрация
                </button>
                <button 
                    onClick={handleTestRegister} 
                    disabled={loading} 
                    style={{ padding: '8px 16px', backgroundColor: '#FF9800', color: 'white' }}
                >
                    Тест регистрации
                </button>
                <button 
                    onClick={handleGetCurrent} 
                    disabled={loading || !localStorage.getItem('token')}
                    style={{ padding: '8px 16px', backgroundColor: '#9C27B0', color: 'white' }}
                    title={!localStorage.getItem('token') ? 'Сначала войдите' : ''}
                >
                    Текущий
                </button>
                <button 
                    onClick={handleLogout} 
                    disabled={loading || !localStorage.getItem('token')}
                    style={{ padding: '8px 16px', backgroundColor: '#F44336', color: 'white' }}
                    title={!localStorage.getItem('token') ? 'Нет активного входа' : ''}
                >
                    Выйти
                </button>
            </div>

            {loading && (
                <div style={{ margin: '10px 0', color: '#666', display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px' }}>⏳</div>
                    <div>Загрузка...</div>
                </div>
            )}
            
            {error && (
                <div style={{ 
                    color: '#d32f2f', 
                    marginTop: '10px', 
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    border: '1px solid #ffcdd2',
                    borderRadius: '4px'
                }}>
                    <strong>❌ Ошибка:</strong> {error}
                </div>
            )}
            
            {result && (
                <div style={{ 
                    marginTop: '10px', 
                    background: '#e8f5e9', 
                    padding: '15px',
                    border: '1px solid #c8e6c9',
                    borderRadius: '4px'
                }}>
                    <strong style={{ color: '#2e7d32' }}>✅ Успех:</strong>
                    <div style={{ marginTop: '10px' }}>
                        <div><strong>ID:</strong> {result.id}</div>
                        <div><strong>Имя:</strong> {result.displayName}</div>
                        <div><strong>Email:</strong> {result.email}</div>
                        <div style={{ marginTop: '5px' }}>
                            <strong>Токен:</strong> 
                            <div style={{ 
                                fontSize: '12px', 
                                backgroundColor: '#f1f8e9', 
                                padding: '5px',
                                marginTop: '2px',
                                wordBreak: 'break-all',
                                border: '1px dashed #c5e1a5'
                            }}>
                                {result.token?.substring(0, 50)}...
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div style={{ 
                marginTop: '20px', 
                fontSize: '12px', 
                color: '#666',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '4px'
            }}>
                <div><strong>Статус:</strong></div>
                <div style={{ marginTop: '5px' }}>
                    <span style={{ marginRight: '10px' }}>
                        Токен: 
                        <span style={{ 
                            color: localStorage.getItem('token') ? '#4CAF50' : '#F44336',
                            fontWeight: 'bold',
                            marginLeft: '5px'
                        }}>
                            {localStorage.getItem('token') ? '✅ Есть' : '❌ Нет'}
                        </span>
                    </span>
                    <span>
                        Пользователь: 
                        <span style={{ 
                            color: localStorage.getItem('user') ? '#4CAF50' : '#F44336',
                            fontWeight: 'bold',
                            marginLeft: '5px'
                        }}>
                            {localStorage.getItem('user') ? '✅ Есть' : '❌ Нет'}
                        </span>
                    </span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#757575' }}>
                    <strong>Описание кнопок:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li><strong>Войти</strong> - войти с введенными email и паролем</li>
                        <li><strong>Регистрация</strong> - зарегистрироваться с введенными данными</li>
                        <li><strong>Тест регистрации</strong> - автоматическая регистрация с уникальными данными</li>
                        <li><strong>Текущий</strong> - получить данные текущего пользователя (требует токен)</li>
                        <li><strong>Выйти</strong> - выйти из системы (очистить токен)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AuthTest;