using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MyAspServer.DB;
using MyAspServer.Models.UserAndAnotherModels;
using System.Web;
using Microsoft.EntityFrameworkCore;

namespace MyAspServer.SignalR
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _appDbContext;
        private static readonly Dictionary<string, string> _userConnection = new();

        public ChatHub(UserManager<User> userManager, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _appDbContext = appDbContext;
        }

        public override async Task OnConnectedAsync()
        {
            var user = await _userManager.FindByNameAsync(Context.User.Identity.Name);

            if (user != null)
            {
                var wasAlreadyOnline = _userConnection.Values.Contains(user.Id);

                _userConnection[Context.ConnectionId] = user.Id;

                if (!wasAlreadyOnline)
                {
                    await Clients.All.SendAsync("UserConnected", new
                    {
                        Id = user.Id,
                        DisplayName = user.DisplayName,
                        AvatarUrl = user.AvatarUrl
                    });
                }
                await SendOnlineUsers();
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (_userConnection.TryGetValue(Context.ConnectionId, out var userId))
            {
                _userConnection.Remove(Context.ConnectionId);

                var isStillOnline = _userConnection.Values.Contains(userId);

                if (!isStillOnline)
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    if (user != null)
                    {
                        await Clients.All.SendAsync("UserDisconnected", user.Id);
                    }
                }
                await SendOnlineUsers();
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string content, string room = "general")
        {
            var sanitizedContent = HttpUtility.HtmlEncode(content);

            var user = await _userManager.FindByNameAsync(Context.User.Identity.Name);
            if (user == null) return;

            var message = new ChatMessage
            {
                Content = sanitizedContent,
                SenderId = user.Id,
                Room = room,
                Timestamp = DateTime.UtcNow
            };

            _appDbContext.ChatMessages.Add(message);
            await _appDbContext.SaveChangesAsync();

            var messageDto = new
            {
                Id = message.Id,
                Content = message.Content,
                Timestamp = message.Timestamp,
                Sender = new
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    AvatarUrl = user.AvatarUrl
                },
                Room = message.Room
            };

            await Clients.All.SendAsync("ReceiveMessage", messageDto);
        }

        public async Task JoinChat(string room = "general")
        {
            var user = await _userManager.FindByNameAsync(Context.User.Identity.Name);
            if (user == null) return;

            await Groups.AddToGroupAsync(Context.ConnectionId, room);

            await Clients.Group(room).SendAsync("UserJoinedRoom", new
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Room = room
            });

            await GetChatHistory(room, 50);
        }

        public async Task LeaveChat(string room = "general")
        {
            var user = await _userManager.FindByNameAsync(Context.User.Identity.Name);
            if (user == null) return;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room);

            await Clients.Group(room).SendAsync("UserLeftRoom", new
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Room = room
            });
        }

        public async Task GetChatHistory(string room = "general", int count = 50)
        {
            var messages = await _appDbContext.ChatMessages
                .Where(m => m.Room == room)
                .OrderByDescending(m => m.Timestamp)
                .Take(count)
                .Include(m => m.Sender)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            var history = messages.Select(m => new
            {
                Id = m.Id,
                Content = m.Content,
                Timestamp = m.Timestamp,
                Sender = new
                {
                    Id = m.Sender.Id,
                    DisplayName = m.Sender.DisplayName,
                    AvatarUrl = m.Sender.AvatarUrl
                },
                Room = m.Room
            });

            await Clients.Caller.SendAsync("ChatHistory", history);
        }

        public async Task SendOnlineUsers()
        {
            var onlineUserIds = _userConnection.Values.Distinct().ToList();

            var onlineUsers = await _userManager.Users
                .Where(s => onlineUserIds.Contains(s.Id))
                .Select(s => new
                {
                    Id = s.Id,
                    DisplayName = s.DisplayName,
                    AvatarUrl = s.AvatarUrl
                })
                .ToListAsync();

            await Clients.All.SendAsync("OnlineUsers", onlineUsers);
        }

        public async Task<List<string>> GetConnectedUsers()
        {
            return _userConnection.Keys.ToList();
        }
    }
}