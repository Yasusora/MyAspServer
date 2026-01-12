### ASP.NET + React Full-Stack Pet Project
## Проект блога с реальным временным чатом, авторизацией и CRUD операциями.

## 🚀 Демо
Frontend: http://localhost:3000

Backend API: http://localhost:5000

SignalR Hub: ws://localhost:5000/chatHub

## 📋 Функциональность
🔐 Аутентификация & Авторизация
JWT токены для безопасного доступа

Регистрация/Вход пользователей

Автоматическое обновление токенов

Ролевая модель (User/Admin)

## 💬 Real-time Чат
Мгновенные сообщения через SignalR

Список онлайн пользователей

История сообщений

Уведомления о подключении/отключении

## 📝 Управление контентом
Создание, редактирование, удаление статей

Комментирование статей

Теги и категории

Статистика просмотров

## 🛠 Технологический стек
Backend (ASP.NET Core)
ASP.NET Core Web API - RESTful API

Entity Framework Core - ORM для работы с БД

SignalR - Real-time коммуникация

JWT Bearer Authentication - Аутентификация

Identity Framework - Управление пользователями

SQL Server / SQLite - База данных

AutoMapper - Маппинг DTO


Frontend (React 18 + TypeScript)
React 18 - Библиотека UI

# Cтруктура:
```markdown
  <tag>
     MyAspServer/                    (на GitHub: ~3 MB)
├── Backend/                   // MyAspServer 
│   ├── MyAspServer/
│   │   ├── Controllers/       
│   │   ├── Models/            
│   │   └── Program.cs
│   └── MyAspServer.csproj
└── Frontend/                   
    └── blog-test-frontend/
        ├── package.json       
        ├── package-lock.json  
        └── src/               

   <tag>
```
## Используемые пакеты 
Microsoft.AspN 2.2.4 
Microsoft.AspNetCore.Authentication.JwtBearer 8.0.0 
Microsoft.AspNetCore.Identity.EntityFrameworkCore 8.0.0 
Microsoft.AspNetCore.Mvc.Core 2.3.0
Microsoft.AspNetCore.SignalR.Core 1.2.0
Microsoft.EntityFrameworkCore 9.0.0
Microsoft.EntityFrameworkCore.SqlServer 9.0.0
Microsoft.Extensions.Identity.Core 10.0.1
Microsoft.IdentityModel.Tokens 8.15.0
System.IdentityModel.Tokens.Jwt 8.15.0

# Start !
 Собоери бекенд : MyAspServer.sln
 Собери фронтенд: установи node.js
 Запусти фронтенд: npm start
 Запусти бекенд

 Проверь соединение http://localhost:5000 получите ошибку 404 в f 12 -значит соединение установлено
 вернитесь http://localhost:3000 и пользуйтесь !

 Рекомендую настроить appsettings.json для личного шифрования.

 P.S. если что то не работает, во всем виноват React, он нужен мне был только для тестирования.
