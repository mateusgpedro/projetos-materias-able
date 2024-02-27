using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;
using ProjetoMateriasAble.Services.Materials;
using ProjetoMateriasAble.Services.Recipes;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/recipe")]
public class RecipeController : ControllerBase
{
    private ApplicationDbContext _dbContext;
    private IMaterialService _materialService;
    private IRecipeService _recipeService;

    public RecipeController(ApplicationDbContext dbContext, IMaterialService materialService, IRecipeService recipeService)
    {
        _dbContext = dbContext;
        _materialService = materialService;
        _recipeService = recipeService;
    }
    
    // [HttpPost("create_recipe")]
    // public async Task<ActionResult> CreateRecipe(CreateRecipeRequest request)
    // {
    //     var sku = await _dbContext.Skus.Include(s => s.Recipe)
    //         .FirstOrDefaultAsync(s => s.Id == request.SkuId);
    //     if (sku == null)
    //         return BadRequest($"Não foi possível encontrar nenhum SKU com o ID {request.SkuId}");
    //     if (sku.RecipeId != null)
    //         return BadRequest($"Já existe uma receita para o SKU com o ID {request.SkuId}");
    //     
    //     
    //     foreach (var key in request.DictionaryData.Keys)
    //     {
    //         // Check if the material with the given ID exists
    //         if (!_materialService.MaterialExists(key))
    //         {
    //             return BadRequest($"O material com o ID {key} não existe.");
    //         }
    //     }
    //     var recipe = new Recipe
    //     {
    //         SkuId = request.SkuId,
    //         QuantitiesData = request.DictionaryData
    //     };
    //
    //     await _dbContext.Recipes.AddAsync(recipe);
    //     sku.Recipe = recipe;
    //     sku.RecipeId = recipe.Id;
    //     await _dbContext.SaveChangesAsync();
    //     return Ok("Receita criada");
    // }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("get_recipe")]
    public async Task<ActionResult<RecipeDto>> GetRecipe([FromQuery] string code)
    {
        var sku = await _dbContext.Skus.Include(s => s.Recipe)
            .FirstOrDefaultAsync(s => s.Code == code);
        if (sku == null)
            return BadRequest($"Não foi possível encontrar nenhum SKU com o código {code}");
    
        if (sku.Recipe == null)
            return BadRequest($"O SKU com o código {code} não possui uma receita");
    
        var recipe = sku.Recipe;

        var materials = await _dbContext.RecipeMaterialsAmounts
            .Include(rma => rma.Material)
            .Where(rma => rma.RecipeId == recipe.Id)
            .Where(rma => rma.Material.Approved == true)
            .Select(rma => new
                RecipeMaterialDto(rma.MaterialId, rma.Material.Code, rma.Material.Name, rma.Amount, rma.Material.Quebra,
                    rma.Material.Cost.ToString())).ToListAsync();
        // var materialIds = recipe.QuantitiesData.Keys.ToList();
        // var materialsList = await _dbContext.Materials
        //     .Where(m => materialIds.Contains(m.Id))
        //     .ToListAsync();
        //
        // var materials = recipe.QuantitiesData
        //     .Select(qs =>
        //     {
        //         var material = materialsList.FirstOrDefault(m => m.Id == qs.Key);
        //         return new RecipeMaterialDto(material.Id, material.Code, material.Name, qs.Value, material.Quebra, material.Cost.ToString());
        //     })
        //     .ToList();
        
        var recipeDto = new RecipeDto(sku.Id, sku.Code, sku.Name, materials);
        return Ok(recipeDto);
    }

    // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    // [HttpPut("edit_recipes")]
    // public async Task<ActionResult<string>> UpdateRecipes(UpdateRecipesRequest request)
    // {
    //     foreach (var item in request.SkuCodesQuantities)
    //     {
    //         var response = await _recipeService.AddMaterialToRecipeAsync(item.SkuCode, request.MaterialId, item.Amount);
    //
    //         if (!response.isSuccess)
    //             return BadRequest(response.Errors);
    //     }
    //
    //     await _dbContext.SaveChangesAsync();
    //     return Ok();
    // }

}