using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Authentication;
using ProjetoMateriasAble.Utils;

namespace ProjetoMateriasAble.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly IConfiguration _configuration;
    private UserManager<AppUser> _userManager;
    private ApplicationDbContext _dbContext;

    public AuthenticationService(IConfiguration configuration, UserManager<AppUser> userManager, ApplicationDbContext dbContext)
    {
        _configuration = configuration;
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<ServiceResponse<string>> CreateTokenAsync(AppUser user)
    {
        ServiceResponse<string> response = new ServiceResponse<string>();

        
        var roles = await _userManager.GetRolesAsync(user);
        
        var roleClaims = roles.Select(role => new Claim(ClaimTypes.Role, role)).ToList();
        
        var claims = await _userManager.GetClaimsAsync(user);
        var subject = new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
        });
        subject.AddClaims(claims);
        subject.AddClaims(roleClaims);

        var key = Encoding.ASCII.GetBytes(_configuration["JwtBearerTokenSettings:SecretKey"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = subject,
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Audience = _configuration["JwtBearerTokenSettings:Audience"],
            Issuer = _configuration["JwtBearerTokenSettings:Issuer"],
            Expires = DateTime.UtcNow.AddDays(60)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

         response.data = tokenHandler.WriteToken(token);
        response.isSuccess = true;
        return response;
    }

    public async Task<ServiceResponse<string>> ValidateTokenAsync(string token)
    {
        ServiceResponse<string> response = new ServiceResponse<string>();

        const string bearerPrefix = "Bearer ";
        if (token.StartsWith(bearerPrefix, StringComparison.OrdinalIgnoreCase))
        {
            token = token.Substring(bearerPrefix.Length);
        }
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters()
        {
            RequireExpirationTime = false,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidAudience = _configuration["JwtBearerTokenSettings:Audience"],
            ValidIssuer = _configuration["JwtBearerTokenSettings:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtBearerTokenSettings:SecretKey"]))
        };
        
        try
        {
            var result = await tokenHandler.ValidateTokenAsync(token, validationParameters);

            if (result.IsValid)
            {
                var jwtToken = tokenHandler.ReadJwtToken(token);
                var email = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email").ToString();
                
                response.isSuccess = true;
                response.data = email;
            }
            else
            {
                response.isSuccess = false;
            }
        }
        catch (Exception e)
        {
            response.isSuccess = false;
            Console.WriteLine(e);   
        }
        
        return response;
    }

    public async Task<ServiceResponse<string>> GenerateRefreshToken(AppUser user)
    {
        var response = new ServiceResponse<string>();
        
        var newRefreshToken = await _userManager.GenerateUserTokenAsync(user, "Default", "RefreshToken");

        var token = new RefreshToken
        {
            UserId = user.Id,
            Expires = DateTime.UtcNow.AddMonths(2),
            Token = newRefreshToken
        };

        await _dbContext.RefreshTokens.AddAsync(token);
        await _dbContext.SaveChangesAsync();
        
        response.isSuccess = true;
        response.data = newRefreshToken;
        return response;
    }
    
    public async Task<ServiceResponse<AppUser>> GetUserByRefreshTokenAsync(string refreshToken)
    {
        var response = new ServiceResponse<AppUser>();
        
        // Assuming _context is your DbContext for Identity
        var userRefreshToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt =>
                rt.Token == refreshToken);
        if (userRefreshToken == null)
        {
            response.isSuccess = false;
            response.Errors.Add("This refresh Token doesn't exist.");
            return response;
        }
        
        var user = await _userManager.FindByIdAsync(userRefreshToken.UserId);
        if (user == null)
        {
            response.isSuccess = false;
            response.Errors.Add("There is no user with this refresh token.");
            return response;
        }

        if (userRefreshToken.Expires < DateTime.UtcNow)
        {
            response.isSuccess = false;
            response.Errors.Add("Refresh Token has expired.");

            _dbContext.RefreshTokens.Remove(userRefreshToken);
            
            return response;
        }
        
        response.isSuccess = true;
        response.data = user;
        return response;
    }
}