using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Infra.Utils;

namespace ProjetoMateriasAble.Services;

public interface IAuthenticationService
{
    Task<ServiceResponse<string>> CreateTokenAsync(string email, AppUser user);
}