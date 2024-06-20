using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.Models;

namespace ToDoApp.Data.Interfaces;
public interface ITaskRepository
{
    Task<IList<ToDoItem>> GetAllTasks(int userId);
    Task<ToDoItem?> GetTaskById(int id);
    Task<ToDoItem> AddTask(ToDoItem task, int userId);
    Task<ToDoItem?> DeleteTask(int id);
    Task<Boolean> DeleteAllTasks(int userId);
    Task<ToDoItem?> UpdateTask(ToDoItem task);
    Task<bool> UpdateTaskPartial(ToDoItem task);
}
