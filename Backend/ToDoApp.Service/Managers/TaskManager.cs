using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Data.Interfaces;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;
using ToDoApp.Service.Interfaces;

namespace ToDoApp.Service.Managers;

public class TaskManager : ITaskManager
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMapper _mapper;
    private readonly ITaskRepository _taskRepository;

    public TaskManager( IHttpContextAccessor httpContextAccessor,IMapper mapper, ITaskRepository taskRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _mapper = mapper;
        _taskRepository = taskRepository;
    }
    public async Task<IList<TaskDTO>> GetAllTasks(bool? isCompleted, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new InvalidOperationException("User ID not found in claims or is invalid.");
        }
        IList<ToDoItem> tasks = await  _taskRepository.GetAllTasks(userId, isCompleted, fromDate, toDate);
        return _mapper.Map<IList<TaskDTO>>(tasks);
    }
    public async Task<TaskDTO?> GetTaskById(int id)
    {
        ToDoItem? task = await _taskRepository.GetTaskById(id);
        if(task == null)
        {
            return null;
        }
        return _mapper.Map<TaskDTO>(task);
    }

    public async Task<bool> TaskExists(TaskAddDTO task)
    {
        var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new InvalidOperationException("User ID not found in claims or is invalid.");
        }
        ToDoItem toDoItem = _mapper.Map<ToDoItem>(task);
        return await _taskRepository.TaskExists(toDoItem, userId);
    }
    public async Task<TaskKpiDTO> GetTaskKPIs()
    {
        return await _taskRepository.GetTaskKPIs();
    }
    public async Task<TaskDTO> AddTask(TaskAddDTO taskToAdd)
    {
        var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new InvalidOperationException("User ID not found in claims or is invalid.");
        }
        ToDoItem task = _mapper.Map<ToDoItem>(taskToAdd);
        ToDoItem taskAdded = await _taskRepository.AddTask(task, userId);
        return _mapper.Map<TaskDTO>(taskAdded);
    }
    public async Task<TaskDTO?> DeleteTask(int id)
    {
        ToDoItem? taskDeleted = await _taskRepository.DeleteTask(id);
        if(taskDeleted == null)
        {
            return null;
        }
        return _mapper.Map<TaskDTO>(taskDeleted);
    }
    public async Task<bool> DeleteAllTasks(bool? isCompleted = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new InvalidOperationException("User ID not found in claims or is invalid.");
        }
        bool isDeleted = await _taskRepository.DeleteAllTasks(userId, isCompleted, fromDate, toDate);
        return isDeleted;
    }
    public async Task<TaskDTO?> UpdateTask(int id,TaskAddDTO taskUpdated)
    {
        var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new InvalidOperationException("User ID not found in claims or is invalid.");
        }
        ToDoItem task = _mapper.Map<ToDoItem>(taskUpdated);
        task.Id = id;
        task.UserId = userId;
        return _mapper.Map<TaskDTO>(await _taskRepository.UpdateTask(task));
    }
    public async Task<bool> UpdateTaskPartial(TaskDTO taskDTO)
    {
        ToDoItem task = _mapper.Map<ToDoItem>(taskDTO);
        return await _taskRepository.UpdateTaskPartial(task);
    }
}
