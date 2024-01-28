using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;
using ProjetoMateriasAble.Services.Materials;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/recipe")]
public class RecipeController : ControllerBase
{
    private ApplicationDbContext _dbContext;
    private IMaterialService _materialService;

    public RecipeController(ApplicationDbContext dbContext, IMaterialService materialService)
    {
        _dbContext = dbContext;
        _materialService = materialService;
    }
    
    [HttpPost("create_recipe")]
    public async Task<ActionResult> CreateRecipe(CreateRecipeRequest request)
    {
        var sku = await _dbContext.Skus.Include(s => s.Recipe)
            .FirstOrDefaultAsync(s => s.Id == request.SkuId);
        if (sku == null)
            return BadRequest($"Não foi possível encontrar nenhum SKU com o ID {request.SkuId}");
        if (sku.RecipeId != null)
            return BadRequest($"Já existe uma receita para o SKU com o ID {request.SkuId}");
        
        
        foreach (var key in request.DictionaryData.Keys)
        {
            // Check if the material with the given ID exists
            if (!_materialService.MaterialExists(key))
            {
                return BadRequest($"O material com o ID {key} não existe.");
            }
        }
        var recipe = new Recipe
        {
            SkuId = request.SkuId,
            QuantitiesData = request.DictionaryData
        };

        await _dbContext.Recipes.AddAsync(recipe);
        sku.Recipe = recipe;
        sku.RecipeId = recipe.Id;
        await _dbContext.SaveChangesAsync();
        return Ok("Receita criada");
    }

    [HttpGet("get_recipe")]
    public async Task<ActionResult<RecipeDto>> GetRecipe([FromQuery] int skuId)
    {
        var sku = await _dbContext.Skus.Include(s => s.Recipe)
            .FirstOrDefaultAsync(s => s.Id == skuId);
        if (sku == null)
            return BadRequest($"Não foi possível encontrar nenhum SKU com o ID {skuId}");

        if (sku.Recipe == null)
            return BadRequest($"O SKU com o ID {skuId} não possui uma receita");

        var recipe = sku.Recipe;
        
        var materialIds = recipe.QuantitiesData.Keys.ToList();
        var materialsList = await _dbContext.Materials
            .Where(m => materialIds.Contains(m.Id))
            .ToListAsync();

        var materials = recipe.QuantitiesData
            .Select(qs =>
            {
                var material = materialsList.FirstOrDefault(m => m.Id == qs.Key);
                return new RecipeMaterialDto(material.Id, material.Name, qs.Value);
            })
            .ToList();
        
        var recipeDto = new RecipeDto(skuId, sku.Name, materials);
        return Ok(recipeDto);
    }

    [HttpGet("get_all_recipes")]
    public async Task<ActionResult<List<RecipeDto>>> GetAllRecipes()
    {
        var recipes = await _dbContext.Recipes.Include(r => r.Sku)
            .ToListAsync();

        var recipeDtos = recipes
            .Select(r => new RecipeDto(
                r.SkuId,
                r.Sku?.Name ?? "Unknown", // Add a null check for r.Sku
                r.QuantitiesData
                    .Select(qs =>
                    {
                        var material = _dbContext.Materials.FirstOrDefault(m => m.Id == qs.Key);
                        return new RecipeMaterialDto(material?.Id ?? 0, material?.Name ?? "Unknown", qs.Value); // Add null checks for material
                    })
                    .ToList()
            ))
            .ToList();

        return Ok(recipeDtos);
    }

    /*[HttpDelete("remove_recipe")]
    public async Task<ActionResult> RemoveRecipe([FromQuery] int skuId)
    {
        var sku = await _dbContext.Skus.Include(s => s.Recipe).FirstOrDefaultAsync(s => s.Id == skuId);
        if (sku == null)
            return BadRequest($"O SKU com o ID {skuId} não existe");
        if (sku.Recipe == null)
            return BadRequest($"O SKU com o ID {skuId} não tem uma receita associada");

        if (sku.RecipeId != null)
        {
            var recipe = await _dbContext.Recipes.FindAsync(sku.RecipeId);
            if (recipe != null)
            {
                _dbContext.Recipes.Remove(recipe);
            }
        }

        sku.Recipe = null;
        sku.RecipeId = null;
        await _dbContext.SaveChangesAsync();
        return Ok();
    }*/
}