using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.DTOs;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private UserManager<AppUser> _userManager;
    private ApplicationDbContext _dbContext;

    public NotificationController(UserManager<AppUser> userManager, ApplicationDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("get_notifications")]
    public async Task<ActionResult> GetNotifications()
    {
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        var userNotifications = await _dbContext.UserNotificationsJoinTable
            .Include(un => un.Notification)
            .OrderByDescending(un => un.Notification.SendTime)
            .Where(un => un.UserId == userId)
            .Select(un => un.Notification)
            .Select(n => new NotificationDTO(
                n.NotificationTitle, 
                n.NotificationMessage,
                n.Url,
                n.SenderUsername,
                n.SendTime))
            .ToListAsync();
        
        return Ok(userNotifications);
    }
}