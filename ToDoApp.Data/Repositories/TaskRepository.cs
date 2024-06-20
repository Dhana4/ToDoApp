using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ToDoApp.Data.Data;
using ToDoApp.Data.Interfaces;
using ToDoApp.Model.Models;

namespace ToDoApp.Data.Repositories;
public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _dbContext;
    public TaskRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<IList<ToDoItem>> GetAllTasks(int userId)
    {
        DateTime today = DateTime.UtcNow.Date;
        return await _dbContext.Tasks
            .Where(tasks => tasks.UserId == userId && !tasks.IsDeleted && tasks.CreatedOn.Date == today)
            .ToListAsync();
    }

    public async Task<ToDoItem?> GetTaskById(int id)
    {
        DateTime today = DateTime.UtcNow.Date;
        return await _dbContext.Tasks.SingleOrDefaultAsync(task => task.Id == id && !task.IsDeleted && task.CreatedOn.Date == today);
    }

    public async Task<ToDoItem> AddTask(ToDoItem task, int userId)
    {
        await _dbContext.Tasks.AddAsync(task);
        task.UserId = userId;
        await _dbContext.SaveChangesAsync();
        return task;
    }

    public async Task<ToDoItem?> DeleteTask(int id)
    {
        var taskToDelete = await _dbContext.Tasks.FindAsync(id);
        if (taskToDelete != null)
        {
            taskToDelete.IsDeleted = true;
            taskToDelete.ModifiedOn = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
            return taskToDelete;
        }
        return null;
    }

    public async Task<Boolean> DeleteAllTasks(int userId)
    {
        var tasksToDelete = _dbContext.Tasks.Where(tasks => tasks.UserId == userId && !tasks.IsDeleted);
        foreach (var task in tasksToDelete)
        {
            task.IsDeleted = true;
            task.ModifiedOn = DateTime.UtcNow;
        }
        await _dbContext.SaveChangesAsync();
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
            existingTask.ModifiedOn = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
            return existingTask;
        }
        return null;
    }
    public async Task<bool> UpdateTaskPartial(ToDoItem task)
    {
        var existingTask = await _dbContext.Tasks.FindAsync(task.Id);
        if (existingTask != null && !existingTask.IsDeleted)
        {
            _dbContext.Entry(existingTask).State = EntityState.Detached;
            if(task.Status == true)
            {
                task.CompletedOn = DateTime.UtcNow;
            }
            task.ModifiedOn = DateTime.UtcNow;
            _dbContext.Tasks.Update(task);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        return false;
    }
}
