using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Services.Sku;

public interface ISkuService
{
    public bool SkuExists(int skuId);
    public Task<ServiceResponse<Models.Platform.Sku>> GetSkuAsync(int id);
}