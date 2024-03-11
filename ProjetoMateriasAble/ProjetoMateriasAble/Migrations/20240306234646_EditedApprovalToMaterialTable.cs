using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class EditedApprovalToMaterialTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPending",
                table: "MaterialApprovals");

            migrationBuilder.AddColumn<int>(
                name: "EStatus",
                table: "MaterialApprovals",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EStatus",
                table: "MaterialApprovals");

            migrationBuilder.AddColumn<bool>(
                name: "IsPending",
                table: "MaterialApprovals",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
