using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoApp.Model.DTOs;

public class UserAddDTO
{
    [Required(ErrorMessage = "Title is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required")]
    public string Password { get; set; } = string.Empty;
}
