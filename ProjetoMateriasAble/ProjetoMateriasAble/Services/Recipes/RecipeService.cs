using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.Utils;
using ProjetoMateriasAble.Models.JoinTables;
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

    public async Task<ServiceResponse<Recipe>> CreateRecipeAsync(Models.Platform.Sku sku, Dictionary<int, int> materialsData)
    {
        var response = new ServiceResponse<Recipe>();
        
        var recipe = new Recipe
        {
            Sku = sku
        };
        
        foreach (var item in materialsData)
        {
            var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Id == item.Key);
            // Check if the material with the given ID exists
            if (material == null)
            {
                response.Errors.Add($"O material com o ID {item.Key} não existe.");
                response.isSuccess = false;
                return response;
            }

            var recipeMaterialAmount = new RecipeMaterialsAmount()
            {
                Amount = item.Value,
                Material = material,
                Recipe = recipe
            };

            await _dbContext.RecipeMaterialsAmounts.AddAsync(recipeMaterialAmount);
            material.RecipeMaterialsAmounts.Add(recipeMaterialAmount);
            recipe.RecipeMaterialsAmounts.Add(recipeMaterialAmount);
        }
        
        response.isSuccess = true;
        response.data = recipe;
        return response;
    }

    public async Task<ServiceResponse> AddMaterialToRecipeAsync(string skuCode, Material material, string amount)
    {
        var response = new ServiceResponse();

        if (!int.TryParse(amount.Trim(), out var quantity))
        {
            response.isSuccess = false;
            response.Errors.Add($"Quantidade de valor {amount} não é um número válido");
            return response;
        }

        var recipe = await _dbContext.Recipes.Include(r => r.Sku).FirstOrDefaultAsync(r => r.Sku.Code == skuCode);
        if (recipe == null)
        {
            response.isSuccess = false;
            response.Errors.Add($"Receita com o código {skuCode} não existe");
            return response;
        }
        
        var recipeMaterialsAmount = new RecipeMaterialsAmount()
        {
            Amount = quantity,
            Material = material,
            Recipe = recipe
        };
        await _dbContext.RecipeMaterialsAmounts.AddAsync(recipeMaterialsAmount);
        recipe.RecipeMaterialsAmounts.Add(recipeMaterialsAmount);
        material.RecipeMaterialsAmounts.Add(recipeMaterialsAmount);
        
        await _dbContext.SaveChangesAsync();
        
        response.isSuccess = true;
        return response;
    }
}