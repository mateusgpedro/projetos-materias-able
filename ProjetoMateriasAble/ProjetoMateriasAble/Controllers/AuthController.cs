using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using ProjetoMateriasAble.DTOs;
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
    [HttpPost("login")]
    public async Task<ActionResult> LoginUser(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
            return BadRequest("There was no user found with this email");
        
        if (!await _userManager.CheckPasswordAsync(user, request.Password))
            return BadRequest("Password Invalid");
        
        var token = await _authenticationService.CreateTokenAsync(user);
        
        if (request.RememberMe)
        {
            var refreshTokenResponse = await _authenticationService.GenerateRefreshToken(user);
            if (!refreshTokenResponse.isSuccess)
                return BadRequest(refreshTokenResponse.Errors);
            
            Response.Cookies.Append("refreshToken", refreshTokenResponse.data, new CookieOptions
            {
                Expires = DateTimeOffset.Now.AddDays(60),
                SameSite = SameSiteMode.None,
                HttpOnly = true,
                Secure = true
            });
        }
        
        return Ok(token.data);
    }

    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = HttpContext.Request.Cookies["refreshToken"];
        
        if (refreshToken == null)
            return BadRequest("There were no refresh tokens found");
        
        var userResponse = await _authenticationService.GetUserByRefreshTokenAsync(refreshToken);
        if (!userResponse.isSuccess)
            return BadRequest(userResponse.Errors);
        
        var token = await _authenticationService.CreateTokenAsync(userResponse.data);
        
        return Ok(token.data);
    }
    
    [HttpPost("logout")]
    public async Task<ActionResult> LogoutUser()
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];
        if (refreshTokenValue != null)
        {
            Response.Cookies.Append("refreshToken", refreshTokenValue, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                SameSite = SameSiteMode.None,
                HttpOnly = true,
                Secure = true
            });
        }

        var refreshToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue);
        if (refreshToken != null)
        {
            _dbContext.RefreshTokens.Remove(refreshToken);
            await _dbContext.SaveChangesAsync();
        }
        
        return Ok();
    }
    
    [AllowAnonymous]
    [HttpPost("validate-jwt")]
    public async Task<ActionResult<LoginDto>> ValidateTokenAsync([FromHeader] string? authorization)
    {
        if (authorization == null)
        {
            return Unauthorized(new { message = "No token provided" });
        }
        
        var result = await _authenticationService.ValidateTokenAsync(authorization);

        if (!result.isSuccess)
        {
            return Unauthorized(result.Errors);
        }

        string email = "";
        const string emailPrefix = "email: ";
        if (result.data.StartsWith(emailPrefix, StringComparison.OrdinalIgnoreCase))
        {
            email = result.data.Substring(emailPrefix.Length);
        }
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return Unauthorized("Usuário não existe");

        var roles = await _userManager.GetRolesAsync(user) as List<string>;
        
        return Ok(new LoginDto(user.FullName, user.Email, roles));
    }
}