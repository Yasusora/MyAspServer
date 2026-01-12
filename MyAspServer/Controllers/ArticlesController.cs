

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyAspServer.DB;
using MyAspServer.Models.LoginAndAnotherModels;
using MyAspServer.Models.UserAndAnotherModels;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace MyAspServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArticlesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticles(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? tag = null)
        {
            var query = _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Comments)
                .OrderByDescending(a => a.CreatidAt)
                .AsQueryable();

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(a => a.Tags != null && a.Tags.Contains(tag));
            }

            var articles = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(articles.Select(a => new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Summary = a.Summary ?? a.Content.Substring(0, Math.Min(200, a.Content.Length)),
                ImageUrl = a.ImageUrl,
                Tags = a.Tags,
                Views = a.Views,
                CreatedAt = a.CreatidAt,
                Author = new UserDto
                {
                    Id = a.Author.Id,
                    DisplayName = a.Author.DisplayName,
                    Email = a.Author.Email,
                    AvatarUrl = a.Author.AvatarUrl
                },
                CommentCount = a.Comments.Count
            }));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDto>> GetArticle(int id)
        {
            var article = await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Comments)
                .ThenInclude(c => c.Author)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null) return NotFound();

            article.Views++;
            await _context.SaveChangesAsync();

            return new ArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Content = article.Content,
                Summary = article.Summary,
                ImageUrl = article.ImageUrl,
                Tags = article.Tags,
                Views = article.Views,
                CreatedAt = article.CreatidAt,
                UpdateAt = article.UpdateAt,
                Author = new UserDto
                {
                    Id = article.Author.Id,
                    DisplayName = article.Author.DisplayName,
                    Email = article.Author.Email,
                    AvatarUrl = article.Author.AvatarUrl
                },
                CommentCount = article.Comments.Count
            };
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ArticleDto>> CreateArticle(CreateArticleDto createArticleDto)
        {
            var user = await _context.Users
              .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

            var article = new Article
            {
                Title = createArticleDto.Title,
                Content = createArticleDto.Content,
                Summary = createArticleDto.Summary,
                ImageUrl = createArticleDto.ImageUrl,
                Tags = createArticleDto.Tags,
                AuthorId = user.Id
            };

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArticle),
                new { id = article.Id },
                new ArticleDto
                {
                    Id = article.Id,
                    Title = article.Title,
                    Content = article.Content,
                    Summary = article.Summary,
                    ImageUrl = article.ImageUrl,
                    Tags = article.Tags,
                    CreatedAt = article.CreatidAt,
                    Author = new UserDto
                    {
                        Id = user.Id,
                        DisplayName = user.DisplayName,
                        Email = user.Email,
                        AvatarUrl = user.AvatarUrl
                    }
                });
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) return Unauthorized();

            var article = await _context.Articles.FindAsync(id);
            if (article == null) return NotFound();

            if (article.AuthorId != user.Id && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}