using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ToDoApp.Web;

public class Middleware_ExceptionHandling : IMiddleware
{
    private readonly ILogger<Middleware_ExceptionHandling> _logger;
    public Middleware_ExceptionHandling(ILogger<Middleware_ExceptionHandling> logger)
    {
        _logger = logger;
    }
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");

            var problemDetails = new ProblemDetails
            {
                Status = (int)HttpStatusCode.InternalServerError,
                Title = "An error occurred while processing your request.",
                Detail = ex.Message,
                Instance = context.Request.Path
            };

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsJsonAsync(problemDetails);
        }
        finally
        {
            _logger.LogInformation("Custom middleware For Handling Exceptions Executing...");
        }
    }
}
