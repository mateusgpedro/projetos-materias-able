using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovedMaterialColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Approved",
                table: "Materials",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Approved",
                table: "Materials");
        }
    }
}
