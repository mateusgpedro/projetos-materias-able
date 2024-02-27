using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class ChangeModelBuilder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_Skus_SkuId",
                table: "Recipes");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_SkuId",
                table: "Recipes");

            migrationBuilder.CreateIndex(
                name: "IX_Skus_RecipeId",
                table: "Skus",
                column: "RecipeId",
                unique: true);

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

            migrationBuilder.DropIndex(
                name: "IX_Skus_RecipeId",
                table: "Skus");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_SkuId",
                table: "Recipes",
                column: "SkuId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_Skus_SkuId",
                table: "Recipes",
                column: "SkuId",
                principalTable: "Skus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
