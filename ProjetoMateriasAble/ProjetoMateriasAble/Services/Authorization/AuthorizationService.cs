using System.Security.Claims;
using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Services;

public class MyAuthorizationService : IMyAuthorizationService
{
    private IHttpContextAccessor _httpContext;

    public MyAuthorizationService(IHttpContextAccessor httpContext)
    {
        _httpContext = httpContext;
    }

    public bool HasRoleAsync(string role)
    {
        var roles = _httpContext.HttpContext.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
        
        return (roles.Any(r => r == role));
    }
}