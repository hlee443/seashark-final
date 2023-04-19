using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using FinalProject.Models;
using FinalProject.Hubs;
using FinalProject.Data;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<MyHub> _hubContext;

        public BookController(ApplicationDbContext context, IHubContext<MyHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Book
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _context.Books.Include(b => b.Author).ToListAsync();
            return new JsonResult(books, new JsonSerializerOptions { ReferenceHandler = ReferenceHandler.IgnoreCycles });
        }

        // GET: api/Book/5
        [HttpGet("{id}")]
        public ActionResult<Book> GetBook(int id)
        {
            var book = _context.Books.Find(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // PUT: api/Book/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book book)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }

            _context.Entry((object)book).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!_context.Books.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    Console.WriteLine("Exception while updating book:");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(ex.StackTrace);

                    // Return a generic error message
                    return StatusCode(500, "An error occurred while updating the book");
                }
            }
            await _hubContext.Clients.All.SendAsync("BookChanged", "updated", book);
            return NoContent();
        }

        // POST: api/Book
        [HttpPost]
        public async Task<ActionResult<Book>> CreateBook(Book book)
        {
            Console.WriteLine("Received book data: " + JsonSerializer.Serialize(book));
            Console.WriteLine(JsonSerializer.Serialize(book.AuthorId));
            Console.WriteLine(JsonSerializer.Serialize(book.Id));
            Console.WriteLine(JsonSerializer.Serialize(book.Title));
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            Console.WriteLine("Saved book data: " + JsonSerializer.Serialize(book));

            await _hubContext.Clients.All.SendAsync("BookChanged", "created", book);

            return CreatedAtAction("GetBook", new { id = book.Id }, book);
        }

        // DELETE: api/Book/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = _context.Books.Find(id);
            if (book == null)
            {
                return NotFound();
            }
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("BookChanged", "deleted", book);

            return NoContent();
        }
    }
}
