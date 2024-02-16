using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class ChangedMaterialsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Cost",
                table: "Materials",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quebra",
                table: "Materials",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cost",
                table: "Materials");

            migrationBuilder.DropColumn(
                name: "Quebra",
                table: "Materials");
        }
    }
}
