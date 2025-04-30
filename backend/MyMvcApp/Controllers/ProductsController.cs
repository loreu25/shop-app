using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMvcApp.Data;
using MyMvcApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace MyMvcApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            Console.WriteLine("Запрос на /api/products получен. Токен: " + HttpContext.Request.Headers["Authorization"]);
            return await _context.Products.ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create(
            [FromForm] string title,
            [FromForm] decimal price,
            [FromForm] string description,
            [FromForm] int stock,
            [FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new { message = "Изображение не выбрано" });

            // Генерируем уникальное имя файла
            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(imagesPath))
                Directory.CreateDirectory(imagesPath);

            var filePath = Path.Combine(imagesPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var product = new Product
            {
                Title = title,
                Price = price,
                Description = description,
                Stock = stock,
                Image = $"/images/{fileName}"
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update(int id, [FromBody] Product updatedProduct)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound(new { message = "Товар не найден" });
            }
            product.Title = updatedProduct.Title;
            product.Price = updatedProduct.Price;
            product.Description = updatedProduct.Description;
            product.Stock = updatedProduct.Stock;

            // Удаление старого изображения, если оно меняется и не дефолтное
            if (product.Image != updatedProduct.Image && !string.IsNullOrEmpty(product.Image) && product.Image.StartsWith("/images/"))
            {
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(oldImagePath))
                {
                    try { System.IO.File.Delete(oldImagePath); } catch {}
                }
            }
            product.Image = updatedProduct.Image;
            _context.SaveChanges();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound(new { message = "Товар не найден" });
            }
            // Удаляем изображение с диска, если оно не дефолтное
            if (!string.IsNullOrEmpty(product.Image) && product.Image.StartsWith("/images/"))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(imagePath))
                {
                    try { System.IO.File.Delete(imagePath); } catch {}
                }
            }
            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok(new { message = "Товар удалён" });
        }
    }
}