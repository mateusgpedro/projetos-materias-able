using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Services.Recipes;

public interface IRecipeService
{ 
    Task<ServiceResponse<Recipe>> CreateSkuAsync(int skuId, Dictionary<int, int> materialsData);
}