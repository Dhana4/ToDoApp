using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using ToDoApp.Model.DTOs;
using ToDoApp.Service.Interfaces;

namespace ToDoApp.Web.Controllers;
[Route("api/[controller]")]
[ApiController]
public class TaskController : Controller
{
    private readonly ITaskManager _taskManager;
    public TaskController(ITaskManager taskManager)
    {
        _taskManager = taskManager;
    }
    [Authorize]
    [HttpGet("userId")]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TaskDTO>))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetAllTasks(int userId)
    {
        try
        {
            IList<TaskDTO> tasks = await _taskManager.GetAllTasks(userId);
            if (tasks.Count == 0)
            {
                return NotFound("No tasks Found");
            }
            return Ok(tasks);
        }
        catch
        {
            return BadRequest("Error occured while fetching tasks");
        }
    }
    [Authorize]
    [HttpGet("id")]
    [ProducesResponseType(200, Type = typeof(TaskDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetTaskById(int id)
    {
        try
        {
            TaskDTO? task = await _taskManager.GetTaskById(id);
            if (task == null)
            {
                return NotFound("Task Not Found");
            }
            return Ok(task);
        }
        catch
        {
            return BadRequest("Error occured while fetching task");
        }
    }
    [Authorize]
    [HttpPost]
    [ProducesResponseType(201, Type = typeof(TaskDTO))]
    [ProducesResponseType(500)]
    public async Task<IActionResult> AddTask(TaskAddDTO taskToAdd, int userId)
    {
        try
        {
            TaskDTO taskAdded = await _taskManager.AddTask(taskToAdd, userId);
            return CreatedAtAction(nameof(GetTaskById), new { taskAdded });
        }
        catch
        {
            return StatusCode(500, "Error occured while adding the task");
        }
    }
    [Authorize]
    [HttpDelete("id")]
    [ProducesResponseType(200, Type = typeof(TaskDTO))]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> DeleteTask(int id)
    {
        try
        {
            TaskDTO? taskDeleted = await _taskManager.DeleteTask(id);
            if (taskDeleted == null)
            {
                return NotFound("Task Not Found");
            }
            return Ok(taskDeleted);
        }
        catch
        {
            return StatusCode(500, "Error occured while deleting task");
        }
    }
    [Authorize]
    [HttpDelete]
    [ProducesResponseType(200, Type = typeof(IList<TaskDTO>))]
    [ProducesResponseType(500)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> DeleteAllTasks(int userId)
    {
        try
        {
            IList<TaskDTO> totalTasks = await _taskManager.GetAllTasks(userId);
            if (totalTasks.Count == 0)
            {
                return BadRequest("No Existing Tasks to delete");
            }
            else
            {
                Boolean isDeleted = await _taskManager.DeleteAllTasks(userId);
                return Ok(isDeleted);
            }
        }
        catch
        {
            return StatusCode(500, "Error occured in deleting the tasks");
        }
    }
    [Authorize]
    [HttpPut("id")]
    [ProducesResponseType(200, Type = typeof(TaskDTO))]
    [ProducesResponseType(500)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateTask(int id, TaskAddDTO taskUpdated, int userId)
    {
        try
        {
            TaskDTO? task = await _taskManager.UpdateTask(id, taskUpdated, userId);
            if (task == null)
            {
                return NotFound("Task Not Found");
            }
            else
            {
                return Ok(task);
            }
        }
        catch
        {
            return StatusCode(500, "Error in updating the task");
        }
    }
    [Authorize]
    [HttpPatch]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateTaskPartial(int taskId, [FromBody] JsonPatchDocument<TaskDTO> patchDocument)
    {
        if (await _taskManager.GetTaskById(taskId) == null)
        {
            return NotFound("Task Not Found");
        }
        TaskDTO existingTask = await _taskManager.GetTaskById(taskId);
        patchDocument.ApplyTo(existingTask, ModelState);
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        bool isTaskUpdated = await _taskManager.UpdateTaskPartial(existingTask!);
        if (!isTaskUpdated)
        {
            return BadRequest("Failed to update employee");
        }
        return Ok();
    }
}
