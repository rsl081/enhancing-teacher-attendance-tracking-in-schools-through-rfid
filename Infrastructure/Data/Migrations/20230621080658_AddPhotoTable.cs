using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    public partial class AddPhotoTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPhoto_AspNetUsers_AppUserId",
                table: "UserPhoto");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPhoto",
                table: "UserPhoto");

            migrationBuilder.RenameTable(
                name: "UserPhoto",
                newName: "UserPhotos");

            migrationBuilder.RenameIndex(
                name: "IX_UserPhoto_AppUserId",
                table: "UserPhotos",
                newName: "IX_UserPhotos_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPhotos",
                table: "UserPhotos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPhotos_AspNetUsers_AppUserId",
                table: "UserPhotos",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPhotos_AspNetUsers_AppUserId",
                table: "UserPhotos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPhotos",
                table: "UserPhotos");

            migrationBuilder.RenameTable(
                name: "UserPhotos",
                newName: "UserPhoto");

            migrationBuilder.RenameIndex(
                name: "IX_UserPhotos_AppUserId",
                table: "UserPhoto",
                newName: "IX_UserPhoto_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPhoto",
                table: "UserPhoto",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPhoto_AspNetUsers_AppUserId",
                table: "UserPhoto",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
