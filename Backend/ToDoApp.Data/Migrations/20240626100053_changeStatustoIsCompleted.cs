using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToDoApp.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeStatustoIsCompleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Tasks",
                newName: "IsCompleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsCompleted",
                table: "Tasks",
                newName: "Status");
        }
    }
}
