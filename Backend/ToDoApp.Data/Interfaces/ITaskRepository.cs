using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;

namespace ToDoApp.Data.Interfaces;
public interface ITaskRepository
{
    Task<IList<ToDoItem>> GetAllTasks(int userId, bool? isCompleted, DateTime? fromDate = null, DateTime? toDate = null);
    Task<ToDoItem?> GetTaskById(int id);
    Task<bool> TaskExists(ToDoItem task, int userId);
    Task<TaskKpiDTO> GetTaskKPIs();
    Task<ToDoItem> AddTask(ToDoItem task, int userId);
    Task<ToDoItem?> DeleteTask(int id);
    Task<Boolean> DeleteAllTasks(int userId, bool? isCompleted = null, DateTime? fromDate = null, DateTime? toDate = null);
    Task<ToDoItem?> UpdateTask(ToDoItem task);
    Task<ToDoItem?> UpdateTaskPartial(ToDoItem task);
}
