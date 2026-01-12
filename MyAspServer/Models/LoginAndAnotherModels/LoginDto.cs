namespace MyAspServer.Models.LoginAndAnotherModels
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterDto
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public string Token { get; set; }
    }

    public class ArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? Summary { get; set; }
        public string? ImageUrl { get; set; }
        public string? Tags { get; set; }
        public int Views { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public UserDto Author { get; set; }
        public int CommentCount { get; set;}
    }

    public class CreateArticleDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string? Summary { get; set; }
        public string? ImageUrl { get; set; }
        public string? Tags { get; set; }
    }

}