using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.Services.Materials;

namespace ProjetoMateriasAble.Services.Recipes;

public class RecipeService : IRecipeService
{
    private IMaterialService _materialService;
    private ApplicationDbContext _dbContext;

    public RecipeService(IMaterialService materialService, ApplicationDbContext dbContext)
    {
        _materialService = materialService;
        _dbContext = dbContext;
    }

    public async Task<ServiceResponse<Recipe>> CreateSkuAsync(int skuId, Dictionary<int, int> materialsData)
    {
        var response = new ServiceResponse<Recipe>();
        
        foreach (var key in materialsData.Keys)
        {
            // Check if the material with the given ID exists
            if (!_materialService.MaterialExists(key))
            {
                response.Errors.Add($"O material com o ID {key} não existe.");
                response.isSuccess = false;
                return response;
            }
        }
        var recipe = new Recipe
        {
            SkuId = skuId,
            QuantitiesData = materialsData
        };

        response.isSuccess = true;
        response.data = recipe;
        return response;
    }
}