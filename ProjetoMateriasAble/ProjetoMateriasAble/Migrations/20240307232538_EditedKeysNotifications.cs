using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoMateriasAble.Migrations
{
    /// <inheritdoc />
    public partial class EditedKeysNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalId1",
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

            migrationBuilder.DropColumn(
                name: "MaterialApprovalId1",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "MaterialApprovalNotification_MaterialApprovalId1",
                table: "Notifications");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "MaterialApprovals",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_MaterialApprovalId",
                table: "Notifications",
                column: "MaterialApprovalId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_MaterialApprovalNotification_MaterialApproval~",
                table: "Notifications",
                column: "MaterialApprovalNotification_MaterialApprovalId");

            migrationBuilder.CreateIndex(
                name: "IX_MaterialApprovals_AppUserId",
                table: "MaterialApprovals",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MaterialApprovals_AspNetUsers_AppUserId",
                table: "MaterialApprovals",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaterialApprovals_AspNetUsers_AppUserId",
                table: "MaterialApprovals");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_MaterialApprovalId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_MaterialApprovalNotification_MaterialApproval~",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_MaterialApprovals_AppUserId",
                table: "MaterialApprovals");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "MaterialApprovals");

            migrationBuilder.AddColumn<int>(
                name: "MaterialApprovalId1",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialApprovalNotification_MaterialApprovalId1",
                table: "Notifications",
                type: "integer",
                nullable: true);

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
                name: "FK_Notifications_MaterialApprovals_MaterialApprovalId1",
                table: "Notifications",
                column: "MaterialApprovalId1",
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
    }
}
