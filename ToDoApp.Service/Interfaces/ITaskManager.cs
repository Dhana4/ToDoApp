using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.DTOs;

namespace ToDoApp.Service.Interfaces;

public interface ITaskManager
{
    Task<IList<TaskDTO>> GetAllTasks(int userId);
    Task<TaskDTO?> GetTaskById(int id);
    Task<TaskDTO> AddTask(TaskAddDTO taskToAdd, int userId);
    Task<TaskDTO?> DeleteTask(int id);
    Task<Boolean> DeleteAllTasks(int userId);
    Task<TaskDTO?> UpdateTask(int id, TaskAddDTO taskToUpdate, int userId);
    Task<bool> UpdateTaskPartial(TaskDTO taskDTO);
}
