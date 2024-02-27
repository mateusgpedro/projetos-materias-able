using ProjetoMateriasAble.Infra.Utils;

namespace ProjetoMateriasAble.Services;

public interface IMyAuthorizationService
{
    bool HasRoleAsync(string role);
}