using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToDoApp.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDueDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedOn",
                table: "Tasks",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "'2024-06-28 11:07:00'",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "'2024-06-26 23:37:52'");

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "Tasks",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "Tasks");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedOn",
                table: "Tasks",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "'2024-06-26 23:37:52'",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "'2024-06-28 11:07:00'");
        }
    }
}
