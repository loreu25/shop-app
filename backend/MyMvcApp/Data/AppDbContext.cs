using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using MyMvcApp.Models;

namespace MyMvcApp.Data
{
    
    public class AppDbContext : DbContext
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users {get; set;}        

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Title = "iPhone 16", Description = "iPhone 16 128 ГБ", Price = 799.99m, Image = "/images/1.jpg" },
                new Product { Id = 2, Title = "iPhone 16e", Description = "iPhone 16e 128 ГБ", Price = 599.99m, Image = "/images/2.jpg" },
                new Product { Id = 3, Title = "iPhone 16 Pro", Description = "iPhone 16 Pro 256 ГБ", Price = 999.99m, Image = "/images/3.jpg" },
                new Product { Id = 4, Title = "iPhone 16 Pro Max", Description = "iPhone 16 Pro Max 512 ГБ", Price = 1199.99m, Image = "/images/4.jpg" },
                new Product { Id = 5, Title = "iPhone 15", Description = "iPhone 15 128 ГБ", Price = 699.99m, Image = "/images/5.jpg" },
                new Product { Id = 6, Title = "iPhone 15 Plus", Description = "iPhone 15 Plus 256 ГБ", Price = 799.99m, Image = "/images/6.jpg" },
                new Product { Id = 7, Title = "iPhone 15 Pro", Description = "iPhone 15 Pro 512 ГБ", Price = 899.99m, Image = "/images/7.jpg" },
                new Product { Id = 8, Title = "iPhone 14", Description = "iPhone 14 128 ГБ", Price = 599.99m, Image = "/images/8.jpg" }
            );
            modelBuilder.Entity<User>().HasData(
        new User
        {
            Id = 1,
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = "$2a$11$RMd91092xos7W1fW2Njbsekd3wOugwkSGNE7XbKATkRx0GzXp0KqO", // пароль: admin123
            Role = "admin"
        },
        new User
        {
            Id = 2,
            Username = "customer",
            Email = "customer@example.com",
            PasswordHash = "$2a$11$3IG4DPsuSYt799kRntnFPOAo9WENM/NsALVX2EqEupyKL3G7ao/KS", // пароль: customer123
            Role = "customer"
        }
    );
        }
    }
}