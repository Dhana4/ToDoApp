using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Data.Interfaces;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;
using ToDoApp.Service.Interfaces;

namespace ToDoApp.Service.Managers;

public class TaskManager : ITaskManager
{
    private readonly IMapper _mapper;
    private readonly ITaskRepository _taskRepository;
    public TaskManager(IMapper mapper, ITaskRepository taskRepository)
    {
        _mapper = mapper;
        _taskRepository = taskRepository;
    }
    public async Task<IList<TaskDTO>> GetAllTasks(int userId)
    {
        IList<ToDoItem> tasks = await  _taskRepository.GetAllTasks(userId);
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
    public async Task<TaskDTO> AddTask(TaskAddDTO taskToAdd, int userId)
    {
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
    public async Task<Boolean> DeleteAllTasks(int userId)
    {
        Boolean isDeleted = await _taskRepository.DeleteAllTasks(userId);
        return isDeleted;
    }
    public async Task<TaskDTO?> UpdateTask(int id,TaskAddDTO taskUpdated, int userId)
    {
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
