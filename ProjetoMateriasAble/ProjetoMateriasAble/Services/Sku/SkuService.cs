using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.Utils;

namespace ProjetoMateriasAble.Services.Sku;

public class SkuService : ISkuService
{
    private ApplicationDbContext _dbContext;

    public SkuService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public bool SkuExists(int skuId)
    {
        return _dbContext.Skus.Any(s => s.Id == skuId);
    }

    public async Task<ServiceResponse<Models.Platform.Sku>> GetSkuAsync(int id)
    {
        var response = new ServiceResponse<Models.Platform.Sku>();
        var sku = await _dbContext.Skus.FirstOrDefaultAsync(s => s.Id == id);
        response.Errors = new List<string>();
        if (sku == null)
        {
            response.Errors.Add($"Não foi possível encontrar o SKU com o ID {id}");
            response.isSuccess = false;
        }
        response.isSuccess = true;
        response.data = sku;
        return response;
    }
}