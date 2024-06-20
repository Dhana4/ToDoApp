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
        }
        finally
        {
            _logger.LogInformation("Custom middleware For Handling Exceptions Executing...");
        }
    }
}
