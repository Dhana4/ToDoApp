using LazyCache;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Data.Data;
using ToDoApp.Data.Interfaces;
using ToDoApp.Model.DTOs;
using ToDoApp.Model.Models;
using ToDoApp.Data.Caching;

namespace ToDoApp.Data.Repositories;
public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _dbContext;
    private readonly ICacheProvider _cacheProvider;
    public TaskRepository(AppDbContext dbContext, ICacheProvider cacheProvider)
    {
        _dbContext = dbContext;
        _cacheProvider = cacheProvider;
    }
    private void ClearCache()
    {
        _cacheProvider.Remove(CacheKeys.ToDoItemCache);
    }

    public async Task<IList<ToDoItem>> GetAllTasks(int userId, bool? isCompleted = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        if (!_cacheProvider.TryGetValue(CacheKeys.ToDoItemCache, out IList<ToDoItem> tasks))
        {
            var query = _dbContext.Tasks
                .Where(t => t.UserId == userId && !t.IsDeleted);

            tasks = await query.ToListAsync();

            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpiration = DateTime.Now.AddMinutes(30),
                SlidingExpiration = TimeSpan.FromMinutes(10),
                Size = 1024
            };
            _cacheProvider.Set(CacheKeys.ToDoItemCache, tasks, cacheEntryOptions);
        }
        var filteredTasks = tasks.AsQueryable();

        if (fromDate.HasValue && toDate.HasValue)
        {
            filteredTasks = filteredTasks.Where(t => t.DueDate >= fromDate && t.DueDate <= toDate);
        }
        else if (fromDate.HasValue)
        {
            filteredTasks = filteredTasks.Where(t => t.DueDate >= fromDate);
        }
        else if (toDate.HasValue)
        {
            filteredTasks = filteredTasks.Where(t => t.DueDate <= toDate);
        }

        if (isCompleted.HasValue)
        {
            filteredTasks = filteredTasks.Where(t => t.IsCompleted == isCompleted.Value);
        }

        return filteredTasks.OrderBy(t => t.IsCompleted).ToList();
    }

    public async Task<ToDoItem?> GetTaskById(int id)
    {
        if (!_cacheProvider.TryGetValue(CacheKeys.ToDoItemCache, out IList<ToDoItem> tasks))
        {
            return await _dbContext.Tasks.SingleOrDefaultAsync(task => task.Id == id && !task.IsDeleted);
        }
        return tasks.SingleOrDefault(task => task.Id == id && !task.IsDeleted);

    }

    public async Task<ToDoItem> AddTask(ToDoItem task, int userId)
    {
        await _dbContext.Tasks.AddAsync(task);
        task.UserId = userId;
        await _dbContext.SaveChangesAsync();
        ClearCache();
        return task;
    }

    public async Task<bool> TaskExists(ToDoItem task, int userId)
    {
        if (!_cacheProvider.TryGetValue(CacheKeys.ToDoItemCache, out IList<ToDoItem> tasks))
        {
            return await _dbContext.Tasks
           .AnyAsync(t => t.UserId == userId
                          && !t.IsDeleted
                          && !t.IsCompleted
                          && t.DueDate >= task.DueDate
                          && t.Title == task.Title
                          && t.Description == task.Description);
        }
        return tasks.Any(t => t.UserId == userId
                          && !t.IsDeleted
                          && !t.IsCompleted
                          && t.DueDate >= task.DueDate
                          && t.Title == task.Title
                          && t.Description == task.Description);
    }
    public async Task<TaskKpiDTO> GetTaskKPIs()
    {
        int totalTasks;
        int completedTasks;
        if (!_cacheProvider.TryGetValue(CacheKeys.ToDoItemCache, out IList<ToDoItem> tasks))
        {
            totalTasks = await _dbContext.Tasks.CountAsync(t => !t.IsDeleted);
            completedTasks = await _dbContext.Tasks.CountAsync(t => !t.IsDeleted && t.IsCompleted);
        }
        else
        {
            totalTasks = tasks.Count(t => !t.IsDeleted);
            completedTasks = tasks.Count(t => !t.IsDeleted && t.IsCompleted);
        }

        int activeTasks = totalTasks - completedTasks;

        TaskKpiDTO taskKPIs = new TaskKpiDTO
        {
            CompletedPercentage = totalTasks > 0 ? (completedTasks * 100) / totalTasks : 0,
            ActivePercentage = totalTasks > 0 ? (activeTasks * 100) / totalTasks : 0
        };

        return taskKPIs;
    }
    public async Task<ToDoItem?> DeleteTask(int id)
    {
        var taskToDelete = await _dbContext.Tasks.FindAsync(id);
        if (taskToDelete != null)
        {
            taskToDelete.IsDeleted = true;
            taskToDelete.ModifiedOn = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
            ClearCache();
            return taskToDelete;
        }
        return null;
    }

    public async Task<bool> DeleteAllTasks(int userId, bool? isCompleted = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var tasksToDelete = _dbContext.Tasks.Where(t => t.UserId == userId && !t.IsDeleted);

        if (fromDate.HasValue && toDate.HasValue)
        {
            tasksToDelete = tasksToDelete.Where(t => t.DueDate >= fromDate && t.DueDate <= toDate);
        }
        else if (fromDate.HasValue)
        {
            tasksToDelete = tasksToDelete.Where(t => t.DueDate >= fromDate);
        }
        else if (toDate.HasValue)
        {
            tasksToDelete = tasksToDelete.Where(t => t.DueDate <= toDate);
        }

        if (isCompleted.HasValue)
        {
            tasksToDelete = tasksToDelete.Where(t => t.IsCompleted == isCompleted.Value);
        }

        foreach (var task in tasksToDelete)
        {
            task.IsDeleted = true;
            task.ModifiedOn = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();
        ClearCache();
        return true;
    }

    public async Task<ToDoItem?> UpdateTask(ToDoItem task)
    {
        var existingTask = await _dbContext.Tasks.FindAsync(task.Id);
        if (existingTask != null && !existingTask.IsDeleted)
        {
            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.UserId = task.UserId;
            existingTask.DueDate = task.DueDate;
            existingTask.DueDate = task.DueDate;
            existingTask.ModifiedOn = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
            ClearCache();
            return existingTask;
        }
        return null;
    }
    public async Task<ToDoItem?> UpdateTaskPartial(ToDoItem task)
    {
        var existingTask = await _dbContext.Tasks.FindAsync(task.Id);
        if (existingTask != null && !existingTask.IsDeleted)
        {
            _dbContext.Entry(existingTask).State = EntityState.Detached;
            if (task.IsCompleted)
            {
                task.CompletedOn = DateTime.UtcNow;
            }
            task.ModifiedOn = DateTime.UtcNow;
            _dbContext.Tasks.Update(task);
            await _dbContext.SaveChangesAsync();
            ClearCache();
            return task;
        }
        return null;
    }

}
