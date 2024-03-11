using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class AddedTypesToNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MaterialApprovals",
                table: "MaterialApprovals");

            migrationBuilder.AddColumn<int>(
                name: "MaterialApprovalId",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialApprovalId1",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialApprovalNotification_MaterialApprovalId",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialApprovalNotification_MaterialApprovalId1",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NotificationType",
                table: "Notifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "MaterialApprovals",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MaterialApprovals",
                table: "MaterialApprovals",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_MaterialApprovalId",
                table: "Notifications",
                column: "MaterialApprovalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_MaterialApprovalId1",
                table: "Notifications",
                column: "MaterialApprovalId1");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_MaterialApprovalNotification_MaterialApprova~1",
                table: "Notifications",
                column: "MaterialApprovalNotification_MaterialApprovalId1");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_MaterialApprovalNotification_MaterialApproval~",
                table: "Notifications",
                column: "MaterialApprovalNotification_MaterialApprovalId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalId",
                table: "Notifications",
                column: "MaterialApprovalId",
                principalTable: "MaterialApprovals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalId1",
                table: "Notifications",
                column: "MaterialApprovalId1",
                principalTable: "MaterialApprovals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalNotificatio~",
                table: "Notifications",
                column: "MaterialApprovalNotification_MaterialApprovalId",
                principalTable: "MaterialApprovals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalNotificati~1",
                table: "Notifications",
                column: "MaterialApprovalNotification_MaterialApprovalId1",
                principalTable: "MaterialApprovals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalId1",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalNotificatio~",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalNotificati~1",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_MaterialApprovalId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_MaterialApprovalId1",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_MaterialApprovalNotification_MaterialApprova~1",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_MaterialApprovalNotification_MaterialApproval~",
                table: "Notifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MaterialApprovals",
                table: "MaterialApprovals");

            migrationBuilder.DropColumn(
                name: "MaterialApprovalId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "MaterialApprovalId1",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "MaterialApprovalNotification_MaterialApprovalId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "MaterialApprovalNotification_MaterialApprovalId1",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NotificationType",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "MaterialApprovals");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MaterialApprovals",
                table: "MaterialApprovals",
                columns: new[] { "MaterialId", "CreatedByID" });
        }
    }
}
