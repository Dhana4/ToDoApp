using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.Models;

namespace ToDoApp.Data.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<ToDoItem> Tasks { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ToDoItem>(task =>
        {
            task.HasKey(t => t.Id);
            task.Property(t => t.Id)
                   .HasDefaultValueSql("NEXT VALUE FOR TaskIdSequence");
                   //.ValueGeneratedOnAdd();
            task.HasOne(t => t.User)
                .WithMany(u => u.ToDoItems)
                .HasForeignKey(t => t.UserId);
            task.Property(t => t.CreatedOn)
            .HasDefaultValueSql("GETUTCDATE()");
            task.Property(t => t.Status)
                    .HasDefaultValue(false);
            task.Property(t => t.IsDeleted)
                    .HasDefaultValue(false);
        });
        modelBuilder.Entity<User>(user =>
        {
            user.HasKey(u => u.Id);
            user.Property(u => u.Id)
                    .HasDefaultValueSql("NEXT VALUE FOR UserIdSequence");
                    //.ValueGeneratedOnAdd();
        });
    }
}
