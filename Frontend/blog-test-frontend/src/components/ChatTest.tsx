import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const ChatTest: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'Не подключено' | 'Подключение...' | 'Подключено' | 'Ошибка подключения'>('Не подключено');
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isConnectingRef = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !connection && !isConnectingRef.current) {
            connectToHub();
        }

        return () => {
            
            if (connection) {
                disconnectFromHub();
            }
        };
    }, []); 

    const connectToHub = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Сначала войдите в систему!');
            setConnectionStatus('Не подключено');
            return;
        }

        if (isConnectingRef.current || connection) {
            console.log('Уже подключается или подключено');
            return;
        }

        isConnectingRef.current = true;
        setConnectionStatus('Подключение...');

        try {
            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5000/chatHub', {
                    accessTokenFactory: () => token,
                    withCredentials: true,
                    skipNegotiation: true, 
                    transport: signalR.HttpTransportType.WebSockets
                })
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: retryContext => {
                        
                        if (retryContext.previousRetryCount > 3) {
                            return 10000; 
                        }
                        return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 10000);
                    }
                })
                .configureLogging(signalR.LogLevel.Information)
                .build();


            hubConnection.on('ReceiveMessage', (message) => {
                console.log('Получено сообщение:', message);
                setMessages(prev => [...prev, message]);
            });

            hubConnection.on('OnlineUsers', (users) => {
                console.log('Онлайн пользователи:', users);
                setOnlineUsers(Array.isArray(users) ? users : []);
            });

            hubConnection.on('UserConnected', (user) => {
                console.log('Пользователь подключился:', user);

                setOnlineUsers(prev => {
            
                    if (!prev.find(u => u.id === user.id)) {
                        return [...prev, user];
                    }
                    return prev;
                });
           
                setMessages(prev => [...prev, {
                    content: `${user.displayName} подключился к чату`,
                    timestamp: new Date(),
                    system: true
                }]);
            });

            hubConnection.on('UserDisconnected', (userId) => {
                console.log('Пользователь отключился, ID:', userId);
                
                setOnlineUsers(prev => prev.filter(user => user.id !== userId));
                
              
                const disconnectedUser = onlineUsers.find(u => u.id === userId);
                if (disconnectedUser) {
                    setMessages(prev => [...prev, {
                        content: `${disconnectedUser.displayName} покинул чат`,
                        timestamp: new Date(),
                        system: true
                    }]);
                }
            });

            hubConnection.on('ChatHistory', (history) => {
                console.log('История чата получена:', history);
                setMessages(Array.isArray(history) ? history : []);
            });

         
            hubConnection.onclose((error) => {
                console.log('Соединение закрыто', error);
                setConnectionStatus('Не подключено');
                setConnection(null);
                isConnectingRef.current = false;
         
            });

            hubConnection.onreconnecting((error) => {
                console.log('Переподключение...', error);
                setConnectionStatus('Подключение...');
            });

            hubConnection.onreconnected((connectionId) => {
                console.log('Переподключено успешно. Connection ID:', connectionId);
                setConnectionStatus('Подключено');
     
                hubConnection.invoke('GetChatHistory', 'general', 50).catch(console.error);
            });

     
            await hubConnection.start();
            
            setConnection(hubConnection);
            setConnectionStatus('Подключено');
            isConnectingRef.current = false;
            
            console.log('SignalR подключен. Connection ID:', hubConnection.connectionId);
            
       
            await hubConnection.invoke('JoinChat', 'general');
            
      
            await hubConnection.invoke('GetChatHistory', 'general', 50);
            
        } catch (error) {
            console.error('Ошибка подключения к SignalR:', error);
            setConnectionStatus('Ошибка подключения');
            setConnection(null);
            isConnectingRef.current = false;
            
      
            setTimeout(() => {
                if (!connection) {
                    connectToHub();
                }
            }, 5000);
        }
    }, [connection, onlineUsers]);

  
    const disconnectFromHub = useCallback(async () => {
        if (connection) {
            try {
           
                await connection.invoke('LeaveChat', 'general');
                
      
                await new Promise(resolve => setTimeout(resolve, 500));
                
      
                await connection.stop();
                
      
                connection.off('ReceiveMessage');
                connection.off('OnlineUsers');
                connection.off('UserConnected');
                connection.off('UserDisconnected');
                connection.off('ChatHistory');
                
            } catch (error) {
                console.error('Ошибка при отключении:', error);
            } finally {
       
                setConnection(null);
                setConnectionStatus('Не подключено');
                setMessages([]);
                setOnlineUsers([]);
                isConnectingRef.current = false;
            }
        }
    }, [connection]);

 
    const sendMessage = async () => {
        if (!connection || connection.state !== signalR.HubConnectionState.Connected || !newMessage.trim()) return;

        try {
            await connection.invoke('SendMessage', newMessage, 'general');
            setNewMessage('');
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    };

   
    const handleLogout = async () => {
        await disconnectFromHub();
        
      
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
       
        window.location.reload();
    };

  
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [messages]);

   
    const getUserName = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.displayName || user.email || 'Неизвестный';
            } catch {
                return 'Неизвестный';
            }
        }
        return 'Неизвестный';
    };

    
    const getConnectionStatus = () => {
        if (connection) {
            switch(connection.state) {
                case signalR.HubConnectionState.Connected:
                    return `Подключено (${connection.connectionId?.substring(0, 8)}...)`;
                case signalR.HubConnectionState.Connecting:
                    return 'Подключение...';
                case signalR.HubConnectionState.Reconnecting:
                    return 'Переподключение...';
                case signalR.HubConnectionState.Disconnected:
                    return 'Отключено';
                default:
                    return connectionStatus;
            }
        }
        return connectionStatus;
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
            <h2>💬 Тест чата (SignalR)</h2>
            
            <div style={{ marginBottom: '15px' }}>
                <div><strong>Статус:</strong> {getConnectionStatus()}</div>
                <div><strong>Пользователь:</strong> {getUserName()}</div>
                <div><strong>Сообщений:</strong> {messages.length}</div>
                <div><strong>Онлайн:</strong> {onlineUsers.length} пользователей</div>
                
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={connectToHub} 
                        disabled={connection?.state === signalR.HubConnectionState.Connected || connection?.state === signalR.HubConnectionState.Connecting}
                        style={{ padding: '8px 16px' }}
                    >
                        {connection?.state === signalR.HubConnectionState.Reconnecting ? 'Переподключение...' : 'Подключиться'}
                    </button>
                    
                    <button 
                        onClick={disconnectFromHub} 
                        disabled={!connection || connection.state === signalR.HubConnectionState.Disconnected}
                        style={{ padding: '8px 16px' }}
                    >
                        Отключиться
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        style={{ padding: '8px 16px', backgroundColor: '#ff4444', color: 'white' }}
                    >
                        Выйти из системы
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Онлайн пользователи */}
                <div style={{ width: '200px' }}>
                    <h4>Онлайн ({onlineUsers.length})</h4>
                    <div style={{ 
                        border: '1px solid #ddd', 
                        padding: '10px', 
                        height: '300px', 
                        overflowY: 'auto',
                        backgroundColor: '#f9f9f9'
                    }}>
                        {onlineUsers.length === 0 ? (
                            <div style={{ color: '#666', fontStyle: 'italic' }}>Нет онлайн пользователей</div>
                        ) : (
                            onlineUsers.map(user => (
                                <div key={user.id} style={{ 
                                    marginBottom: '5px',
                                    padding: '5px',
                                    backgroundColor: '#e3f2fd',
                                    borderRadius: '3px'
                                }}>
                                    👤 {user.displayName}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Чат */}
                <div style={{ flex: 1 }}>
                    <div style={{ 
                        border: '1px solid #ddd', 
                        padding: '10px', 
                        height: '300px', 
                        overflowY: 'auto',
                        marginBottom: '10px',
                        backgroundColor: 'white'
                    }}>
                        {messages.length === 0 ? (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                height: '100%',
                                color: '#666',
                                fontStyle: 'italic'
                            }}>
                                {connection?.state === signalR.HubConnectionState.Connected 
                                    ? 'Нет сообщений. Начните общение!' 
                                    : 'Подключитесь к чату'}
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} style={{ 
                                    marginBottom: '8px',
                                    padding: '8px',
                                    backgroundColor: msg.system ? '#f0f0f0' : '#e3f2fd',
                                    borderRadius: '5px',
                                    borderLeft: `4px solid ${msg.system ? '#888' : '#2196f3'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{msg.sender?.displayName || msg.sender || 'Система'}</strong>
                                        <span style={{ fontSize: '10px', color: '#666' }}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                    <div>{msg.content}</div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ display: 'flex' }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder={
                                connection?.state === signalR.HubConnectionState.Connected
                                    ? "Введите сообщение и нажмите Enter..."
                                    : "Подключитесь к чату для отправки сообщений"
                            }
                            style={{ 
                                flex: 1, 
                                marginRight: '10px', 
                                padding: '10px',
                                border: `1px solid ${connection?.state === signalR.HubConnectionState.Connected ? '#2196f3' : '#ccc'}`,
                                borderRadius: '4px'
                            }}
                            disabled={connection?.state !== signalR.HubConnectionState.Connected}
                        />
                        <button 
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || connection?.state !== signalR.HubConnectionState.Connected}
                            style={{ 
                                padding: '10px 20px',
                                backgroundColor: connection?.state === signalR.HubConnectionState.Connected ? '#2196f3' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: connection?.state === signalR.HubConnectionState.Connected ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Отправить
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', padding: '10px', backgroundColor: '#f9f9f9' }}>
                <div><strong>Отладка:</strong></div>
                <div>Токен: {localStorage.getItem('token') ? '✅ Есть' : '❌ Нет'}</div>
                <div>Состояние соединения: {connection?.state || 'Нет соединения'}</div>
                <div style={{ marginTop: '5px' }}>
                    <button 
                        onClick={() => console.log('Состояние:', { connection, messages, onlineUsers })}
                        style={{ fontSize: '10px', padding: '5px' }}
                    >
                        Лог в консоль
                    </button>
                    <button 
                        onClick={() => setMessages([])}
                        style={{ fontSize: '10px', padding: '5px', marginLeft: '10px' }}
                    >
                        Очистить сообщения
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatTest;