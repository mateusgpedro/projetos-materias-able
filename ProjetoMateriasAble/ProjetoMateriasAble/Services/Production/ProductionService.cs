using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.Utils;

namespace ProjetoMateriasAble.Services.Production;

public class ProductionService : IProductionService
{
    private ApplicationDbContext _dbContext;

    public ProductionService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ServiceResponse<List<RequiredMaterialsDto>>> GetRequiredMaterials(int planId)
    {
        var response = new ServiceResponse<List<RequiredMaterialsDto>>();

        var productionOrders = await _dbContext.ProductionOrders
            .Include(po => po.ProductionPlan)
            .Include(po => po.Sku)
            .ThenInclude(s => s.Recipe)
            .Where(po => po.PlanId == planId)
            .ToListAsync();

        var materialRequirements = new List<RequiredMaterialsDto>();

        foreach (var productionOrder in productionOrders)
        {
            if (productionOrder.Sku.Recipe != null)
                foreach (var entry in productionOrder.Sku.Recipe.QuantitiesData)
                {
                    var materialId = entry.Key;
                    var requiredAmount = entry.Value * productionOrder.UnitiesToProduce;

                    var material = _dbContext.Materials.Find(materialId);

                    if (material != null)
                    {
                        var availableStock = material.Amount;
                        var balance = availableStock - requiredAmount;
                        
                        var requirementDto = new RequiredMaterialsDto(material.Id, material.Name, requiredAmount, availableStock, balance);

                        materialRequirements.Add(requirementDto);
                    }
                }
        }

        response.isSuccess = true;
        response.data = materialRequirements;
        return response;
    }
    
}