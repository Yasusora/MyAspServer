
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyAspServer.Models.UserAndAnotherModels;


namespace MyAspServer.DB
{
    public class AppDbContext : IdentityDbContext<User>
    {
         public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
         {
         }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Article>()
                .HasOne(a => a.Author)
                .WithMany(u => u.Articles)
                .HasForeignKey(a => a.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Comment>()
                .HasOne(c => c.Author)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(u => u.Replies)
                .HasForeignKey(m => m.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}