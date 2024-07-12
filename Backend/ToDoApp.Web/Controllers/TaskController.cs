using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Threading.Tasks;
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
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(IEnumerable<TaskDTO>))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetAllTasks([FromQuery] bool? isCompleted = null, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
    {
        try
        {
            IList<TaskDTO>  tasks = await _taskManager.GetAllTasks(isCompleted, fromDate, toDate);
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
    [HttpGet("kpis")]
    [ProducesResponseType(200, Type = typeof(TaskKpiDTO))]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> GetTaskKPIs()
    {
        try
        {
            TaskKpiDTO taskKPIs = await _taskManager.GetTaskKPIs();
            return Ok(taskKPIs);
        }
        catch
        {
            return StatusCode(500, "Error occurred while fetching task KPIs");
        }
    }
    [Authorize]
    [HttpPost]
    [ProducesResponseType(201, Type = typeof(TaskDTO))]
    [ProducesResponseType(500)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> AddTask(TaskAddDTO taskToAdd)
    {
        try
        {
            if (await _taskManager.TaskExists(taskToAdd))
            {
                return Conflict("A similar task already exists.");
            }

            TaskDTO taskAdded = await _taskManager.AddTask(taskToAdd);
            return CreatedAtAction(nameof(GetTaskById), new { id = taskAdded.Id }, taskAdded);
        }
        catch
        {
            return StatusCode(500, "Error occurred while adding the task");
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
    public async Task<IActionResult> DeleteAllTasks([FromQuery] bool? isCompleted = null, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
    {
        try
        {
            IList<TaskDTO> totalTasks = await _taskManager.GetAllTasks(null);
            if (totalTasks.Count == 0)
            {
                return BadRequest("No Existing Tasks to delete");
            }
            else
            {
                bool isDeleted = await _taskManager.DeleteAllTasks(isCompleted, fromDate, toDate);
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
    public async Task<IActionResult> UpdateTask(int id, TaskAddDTO taskUpdated)
    {
        try
        {
            TaskDTO? task = await _taskManager.UpdateTask(id, taskUpdated);
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
        TaskDTO? taskPartiallyUpdated = await _taskManager.UpdateTaskPartial(existingTask!);
        if (taskPartiallyUpdated == null)
        {
            return BadRequest("Failed to update employee");
        }
        return Ok(taskPartiallyUpdated);
    }
}
