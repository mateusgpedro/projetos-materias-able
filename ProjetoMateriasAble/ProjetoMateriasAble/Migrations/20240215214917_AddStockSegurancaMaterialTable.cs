using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class AddStockSegurancaMaterialTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StockSeguranca",
                table: "Materials",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StockSeguranca",
                table: "Materials");
        }
    }
}
