import React, { useState, useEffect } from 'react';
import agent from '../api/agent';

const ArticlesTest: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [newArticle, setNewArticle] = useState({
        title: 'Новая тестовая статья',
        content: 'Содержание тестовой статьи...'
    });
    
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
    const [articleDetails, setArticleDetails] = useState<any>(null);

    const loadArticles = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await agent.Articles.getAll();
            setArticles(data);
            console.log('Статьи загружены:', data);
        } catch (err: any) {
            setError('Ошибка загрузки статей: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };


    const handleCreateArticle = async () => {
        setLoading(true);
        setError('');
        try {
            const article = await agent.Articles.create(newArticle);
            console.log('Статья создана:', article);
            await loadArticles(); 
        } catch (err: any) {
            setError('Ошибка создания статьи: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };


    const handleGetArticleDetails = async (id: number) => {
        setLoading(true);
        setError('');
        try {
            const article = await agent.Articles.getById(id);
            setArticleDetails(article);
            console.log('Детали статьи:', article);
        } catch (err: any) {
            setError('Ошибка загрузки деталей: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteArticle = async (id: number) => {
        if (!window.confirm('Удалить статью?')) return;
        
        setLoading(true);
        setError('');
        try {
            await agent.Articles.delete(id);
            console.log('Статья удалена:', id);
            await loadArticles();
            setArticleDetails(null);
        } catch (err: any) {
            setError('Ошибка удаления: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        loadArticles();
    }, []);

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
            <h2>📝 Тест статей</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <h3>Создать статью</h3>
                <div>
                    <div>
                        <label>Название: </label>
                        <input 
                            type="text" 
                            value={newArticle.title}
                            onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                            style={{ width: '300px', marginLeft: '10px' }}
                        />
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <label>Содержание: </label>
                        <textarea 
                            value={newArticle.content}
                            onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                            style={{ width: '300px', marginLeft: '10px', height: '60px' }}
                        />
                    </div>
                    <button onClick={handleCreateArticle} disabled={loading} style={{ marginTop: '10px' }}>
                        Создать статью
                    </button>
                </div>
            </div>

            <div>
                <h3>Список статей ({articles.length})</h3>
                <button onClick={loadArticles} disabled={loading} style={{ marginBottom: '10px' }}>
                    Обновить список
                </button>
                
                {loading && <div>Загрузка...</div>}
                {error && <div style={{ color: 'red' }}>Ошибка: {error}</div>}
                
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
                    {articles.length === 0 ? (
                        <div>Нет статей</div>
                    ) : (
                        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Автор</th>
                                    <th>Дата</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map(article => (
                                    <tr key={article.id} style={{ cursor: 'pointer' }}>
                                        <td>{article.id}</td>
                                        <td>{article.title}</td>
                                        <td>{article.author?.displayName || 'Нет автора'}</td>
                                        <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleGetArticleDetails(article.id)}
                                                style={{ marginRight: '5px' }}
                                            >
                                                Подробнее
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteArticle(article.id)}
                                                style={{ color: 'red' }}
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {articleDetails && (
                <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px' }}>
                    <h3>Детали статьи #{articleDetails.id}</h3>
                    <div>
                        <strong>Название:</strong> {articleDetails.title}
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <strong>Содержание:</strong> 
                        <div style={{ background: '#f5f5f5', padding: '10px', marginTop: '5px' }}>
                            {articleDetails.content}
                        </div>
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <strong>Автор:</strong> {articleDetails.author?.displayName}
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <strong>Дата создания:</strong> {new Date(articleDetails.createdAt).toLocaleString()}
                    </div>
                    <button 
                        onClick={() => setArticleDetails(null)}
                        style={{ marginTop: '10px' }}
                    >
                        Закрыть
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArticlesTest;