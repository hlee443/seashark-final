using FinalProject.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FinalProject.Models;
using FinalProject.Hubs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<MyHub> _hubContext;

        public AuthorController(ApplicationDbContext context, IHubContext<MyHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Author
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        {
            var authors = await _context.Authors.Include(a => a.Books).ToListAsync();
            return new JsonResult(authors, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.IgnoreCycles });
        }

        // GET: api/Author/5
        [HttpGet("{id}")]
        public ActionResult<Author> GetAuthor(int id)
        {
            var author = _context.Authors.Find(id);

            if (author == null)
            {
                return NotFound();
            }

            return author;
        }

        // POST: api/Author
        [HttpPost]
        public async Task<ActionResult<Author>> CreateAuthor(Author author)
        {
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("AuthorChanged", "created", author);

            return CreatedAtAction("GetAuthor", new { id = author.Id }, author);
        }

        // PUT: api/Author/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, Author author)
        {
            if (id != author.Id)
            {
                return BadRequest();
            }

            _context.Entry(author).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!_context.Authors.Any(a => a.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    // Add logging to the exception
                    Console.WriteLine("Exception while updating author:");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(ex.StackTrace);

                    // Return a generic error message
                    return StatusCode(500, "An error occurred while updating the author");
                }
            }

            await _hubContext.Clients.All.SendAsync("AuthorChanged", "updated", author);

            return NoContent();
        }

        // DELETE: api/Author/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = _context.Authors.Find(id);
            if (author == null)
            {
                return NotFound();
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("AuthorChanged", "deleted", author);

            return NoContent();
        }
    }
}
