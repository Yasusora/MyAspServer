using Microsoft.AspNetCore.Identity;

namespace MyAspServer.Models.UserAndAnotherModels
{
    public class User : IdentityUser
    {
        public string DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;


        public virtual ICollection<Article> Articles { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<ChatMessage> ChatMessages { get; set; }
    }
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? Summary { get; set; }
        public string? ImageUrl { get; set; }
        public string? Tags { get; set; } // json ?
        public int Views { get; set; } = 0;
        public DateTime CreatidAt { get; set; } = DateTime.Now;
        public DateTime? UpdateAt { get; set; }


        public string AuthorId { get; set; }
        public virtual User Author { get; set; }


        public virtual ICollection<Comment> Comments { get; set; }
    }
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAd { get; set; } = DateTime.UtcNow;


        public string AuthorId { get; set; }
        public virtual User Author { get; set; }


        public int ArticleId { get; set; }
        public virtual Article Article { get; set; }


        public int? ParentCommentId { get; set; }
        public virtual Comment? ParentComment { get; set; }
        public virtual ICollection<Comment> Replies { get; set; }

    }
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string SenderId { get; set; }
        public virtual User Sender {  get; set; }

        public string? Room { get; set; } = "general";
    }
}

