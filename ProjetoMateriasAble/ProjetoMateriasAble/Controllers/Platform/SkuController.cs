using System.Security.Claims;
using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.JoinTables;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.Services.Recipes;
using ProjetoMateriasAble.Utils;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/sku")]
public class SkuController : ControllerBase
{
    private ApplicationDbContext _dbContext;
    private IRecipeService _recipeService;

    public SkuController(ApplicationDbContext dbContext, IRecipeService recipeService)
    {
        _dbContext = dbContext;
        _recipeService = recipeService;
    }

    [HttpPost("add_sku")]
    public async Task<ActionResult<string>> AddSku(NewSkuRequest request)
    {
        using (var transaction = await _dbContext.Database.BeginTransactionAsync())
        {
            try
            {
                var sku = await _dbContext.Skus.FirstOrDefaultAsync(s => s.Code == request.Code);

                if (sku != null)
                    return BadRequest($"Já existe um sku com o código \"{request.Code}\" na lista de Skus");

                
                var newSku = new Sku
                {
                    Code = request.Code,
                    Name = request.Name,
                    Description = $"{request.Code} - {request.Name}",
                };
                var createResponse = await _recipeService.CreateSkuAsync(newSku.Id, request.MaterialsData);
                if (!createResponse.isSuccess)
                    return BadRequest(createResponse.Errors);
                
                foreach (var linhaId in request.LinhasDeEnchimento)
                {
                    var linha = await _dbContext.LinhasDeEnchimento.FirstOrDefaultAsync(le => le.Id == linhaId);
                    if (linha == null)
                        return BadRequest($"Linha de enchimento com o id {linhaId} não foi encontrada");
                    
                    var skuLinhaEnchimento = new SkuLinhaEnchimento()
                    {
                        LinhaDeEnchimento = linha,
                        LinhaDeEnchimentoId = linhaId,
                        Sku = newSku,
                        SkuId = newSku.Id
                    };
                    await _dbContext.SkusLinhasDeEnchimento.AddAsync(skuLinhaEnchimento);
                    newSku.SkusLinhasDeEnchimento.Add(skuLinhaEnchimento);
                    linha.SkusLinhasDeEnchimento.Add(skuLinhaEnchimento);
                }
                
                newSku.Recipe = createResponse.data;
                newSku.RecipeId = createResponse.data.Id;
        
                await _dbContext.Skus.AddAsync(newSku);
                await _dbContext.Recipes.AddAsync(createResponse.data);
                
                await _dbContext.SaveChangesAsync();
                
                transaction.Commit();
                
                return Ok($"{request.Name} foi adicionado à lista de Skus");
            }
            catch (Exception e)
            {
                transaction.Rollback();
                return StatusCode(500, $"Erro interno: {e.Message}");
            }
        }
    }

    [HttpGet("get_skus")]
    public async Task<ActionResult<SkuListDTO>> GetAllSkus([FromQuery] string? name, [FromQuery] uint? idLinha, [FromQuery] int page, [FromQuery] int pageSize)
    { 
        var filteredSkus = await _dbContext.Skus.Include(s => s.SkusLinhasDeEnchimento).ToListAsync();
        
        if (name != null)
        {
            filteredSkus = filteredSkus.Where(s => Diacritics.RemoveDiacritics(s.Description).Contains(Diacritics.RemoveDiacritics(name), StringComparison.OrdinalIgnoreCase)).ToList();
        }
        
        if (idLinha != null && filteredSkus != null)
        {
            filteredSkus = filteredSkus.Where(s => s.SkusLinhasDeEnchimento != null && s.SkusLinhasDeEnchimento.Any(slde => slde.LinhaDeEnchimentoId == idLinha))
                .ToList();
        }

        var pagesCount = filteredSkus.Count / pageSize;
        filteredSkus = filteredSkus.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        var skuList = new SkuListDTO(filteredSkus.Select(s =>
            {
                var listaEnchimento = _dbContext.SkusLinhasDeEnchimento
                    .Include(sle => sle.LinhaDeEnchimento)
                    .Where(sle => sle.SkuId == s.Id)
                    .Select(sle => sle.LinhaDeEnchimento.Name).ToList();
                return new SkuDto(s.Code, s.Name, s.Description, listaEnchimento);
            }).ToList(),
            pagesCount + 1);
        
        return Ok(skuList);
    }

    // [HttpGet("get_sku")]
    // public async Task<ActionResult<SkuDto>> GetSku([FromQuery] int id)
    // {
    //     var sku = await _dbContext.Skus.FirstOrDefaultAsync(s => s.Id == id);
    //
    //     if (sku == null)
    //         return BadRequest($"Não foi possível encontrar um sku com o id \"{id}\"");
    //
    //     var dto = new SkuDto(sku.Code, sku.Name, sku.Description);
    //     return Ok(sku);
    // }

    [HttpDelete("remove_sku")]
    public async Task<ActionResult<string>> RemoveSku([FromQuery] int id)
    {
        var sku = await _dbContext.Skus.FirstOrDefaultAsync(s => s.Id == id);
        if (sku == null)
            return BadRequest($"Não foi possível encontrar um sku com o id \"{id}\"");

        _dbContext.Skus.Remove(sku);
        await _dbContext.SaveChangesAsync();
        return Ok($"\"{sku.Name}\", foi removido com sucesso da lista de SKUs");
    }
}