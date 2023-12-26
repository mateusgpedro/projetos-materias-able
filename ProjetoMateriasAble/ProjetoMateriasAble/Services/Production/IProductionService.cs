using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra.Utils;

namespace ProjetoMateriasAble.Services.Production;

public interface IProductionService
{
    public Task<ServiceResponse<List<RequiredMaterialsDto>>> GetRequiredMaterials(int planId);
}