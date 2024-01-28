using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class AddedJoinTableSkuLinhaDeEnchimento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LinhasDeEnchimento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LinhasDeEnchimento", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SkusLinhasDeEnchimento",
                columns: table => new
                {
                    SkuId = table.Column<int>(type: "integer", nullable: false),
                    LinhaDeEnchimentoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkusLinhasDeEnchimento", x => new { x.SkuId, x.LinhaDeEnchimentoId });
                    table.ForeignKey(
                        name: "FK_SkusLinhasDeEnchimento_LinhasDeEnchimento_LinhaDeEnchimento~",
                        column: x => x.LinhaDeEnchimentoId,
                        principalTable: "LinhasDeEnchimento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SkusLinhasDeEnchimento_Skus_SkuId",
                        column: x => x.SkuId,
                        principalTable: "Skus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SkusLinhasDeEnchimento_LinhaDeEnchimentoId",
                table: "SkusLinhasDeEnchimento",
                column: "LinhaDeEnchimentoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SkusLinhasDeEnchimento");

            migrationBuilder.DropTable(
                name: "LinhasDeEnchimento");
        }
    }
}
