using FinalProject.Models;
using Microsoft.EntityFrameworkCore;


namespace FinalProject.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Author>? Authors { get; set; }
        public DbSet<Book>? Books { get; set; }


        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
                    : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Author>().HasKey(a => a.Id);
            modelBuilder.Entity<Book>().HasKey(b => b.Id);
            modelBuilder.Entity<Book>().HasOne(b => b.Author).WithMany(a => a.Books).HasForeignKey(b => b.AuthorId);
        }
    }
}