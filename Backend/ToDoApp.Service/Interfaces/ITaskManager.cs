using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;

namespace ToDoApp.Service.Interfaces;

public interface ITaskManager
{
    Task<IList<TaskDTO>> GetAllTasks(bool? isCompleted, DateTime? fromDate = null, DateTime? toDate = null);
    Task<TaskDTO?> GetTaskById(int id);
    Task<bool> TaskExists(TaskAddDTO task);
    Task<TaskKpiDTO> GetTaskKPIs();
    Task<TaskDTO> AddTask(TaskAddDTO taskToAdd);
    Task<TaskDTO?> DeleteTask(int id);
    Task<Boolean> DeleteAllTasks(bool? isCompleted = null, DateTime? fromDate = null, DateTime? toDate = null);
    Task<TaskDTO?> UpdateTask(int id, TaskAddDTO taskToUpdate);
    Task<TaskDTO?> UpdateTaskPartial(TaskDTO taskDTO);
}
