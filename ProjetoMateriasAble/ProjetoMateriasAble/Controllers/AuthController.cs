using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models;
using ProjetoMateriasAble.Services;
using ProjetoMateriasAble.Utils;

namespace ProjetoMateriasAble.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private ApplicationDbContext _dbContext;
    private UserManager<AppUser> _userManager;
    private IAuthenticationService _authenticationService;

    public AuthController(ApplicationDbContext dbContext, UserManager<AppUser> userManager, IAuthenticationService authenticationService)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _authenticationService = authenticationService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegistrationRequest request)
    {
       var newUser = new AppUser()
        {
            UserName = request.Username,
            FullName = request.FullName,
            Email = request.Email,
        };
        var result = await _userManager.CreateAsync(newUser, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors.ConvertToProblemDetails());
        
        await _dbContext.SaveChangesAsync();
        return Ok("Registered");
    }
    
    [AllowAnonymous]
    [HttpGet("login")]
    public async Task<ActionResult> LoginUser(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
            return BadRequest("There was no user found with this email");
        if (!_userManager.CheckPasswordAsync(user, request.Password).Result)
            return BadRequest("Password Invalid");

        var token = await _authenticationService.CreateTokenAsync(request.Email, user);
        return Ok(token.data);
    }
}