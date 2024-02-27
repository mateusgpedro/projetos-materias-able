using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Services.Recipes;

public interface IRecipeService
{ 
    Task<ServiceResponse<Recipe>> CreateRecipeAsync(Models.Platform.Sku sku, Dictionary<int, int> materialsData);

    Task<ServiceResponse> AddMaterialToRecipeAsync(string skuCode, Material material, string amount);

}