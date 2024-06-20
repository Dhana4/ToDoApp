using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoApp.Model.DTOs;

public class TaskDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime? CompletedOn { get; set; } = null;
    public bool Status { get; set; } = false;
    public DateTime CreatedOn { get; set; }
}
