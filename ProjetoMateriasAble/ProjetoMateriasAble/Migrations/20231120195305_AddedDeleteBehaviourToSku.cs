using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class AddedDeleteBehaviourToSku : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Skus_Recipes_RecipeId",
                table: "Skus");

            migrationBuilder.AddForeignKey(
                name: "FK_Skus_Recipes_RecipeId",
                table: "Skus",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Skus_Recipes_RecipeId",
                table: "Skus");

            migrationBuilder.AddForeignKey(
                name: "FK_Skus_Recipes_RecipeId",
                table: "Skus",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id");
        }
    }
}
