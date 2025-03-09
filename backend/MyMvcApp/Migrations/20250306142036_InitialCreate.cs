using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MyMvcApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Description", "Image", "Price", "Title" },
                values: new object[,]
                {
                    { 1, "iPhone 16 128 ГБ", "/images/1.jpg", 799.99m, "iPhone 16" },
                    { 2, "iPhone 16e 128 ГБ", "/images/2.jpg", 599.99m, "iPhone 16e" },
                    { 3, "iPhone 16 Pro 256 ГБ", "/images/3.jpg", 999.99m, "iPhone 16 Pro" },
                    { 4, "iPhone 16 Pro Max 512 ГБ", "/images/4.jpg", 1199.99m, "iPhone 16 Pro Max" },
                    { 5, "iPhone 15 128 ГБ", "/images/5.jpg", 699.99m, "iPhone 15" },
                    { 6, "iPhone 15 Plus 256 ГБ", "/images/6.jpg", 799.99m, "iPhone 15 Plus" },
                    { 7, "iPhone 15 Pro 512 ГБ", "/images/7.jpg", 899.99m, "iPhone 15 Pro" },
                    { 8, "iPhone 14 128 ГБ", "/images/8.jpg", 599.99m, "iPhone 14" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
