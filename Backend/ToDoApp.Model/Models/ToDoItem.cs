using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoApp.Model.Models;
public class ToDoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedOn { get; set; } = null;
    public bool IsCompleted { get; set; } = false;
    public int UserId { get; set; }
    public DateTime? ModifiedOn { get; set; } = null;
    public bool IsDeleted { get; set; } = false;
    public DateTime? DueDate { get; set; }
    public User? User { get; set; }
}
