using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Infra.Utils;

namespace ProjetoMateriasAble.Services;

public interface IAuthenticationService
{
    Task<ServiceResponse<string>> CreateTokenAsync(AppUser user);

    Task<ServiceResponse<bool>> ValidateTokenAsync(string token);

    Task<ServiceResponse<string>> GenerateRefreshToken(AppUser user);

    Task<ServiceResponse<AppUser>> GetUserByRefreshTokenAsync(string refreshToken);
}