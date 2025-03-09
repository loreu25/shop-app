using Microsoft.EntityFrameworkCore;
using MyMvcApp.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Разрешить запросы с этого домена
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
var app = builder.Build();

app.UseCors("AllowReactApp");

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
