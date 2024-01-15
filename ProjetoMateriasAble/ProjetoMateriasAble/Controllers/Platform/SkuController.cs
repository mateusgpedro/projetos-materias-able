using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/sku")]
public class SkuController : ControllerBase
{
    private ApplicationDbContext _dbContext;

    public SkuController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("add_sku")]
    public async Task<ActionResult<string>> AddSku(NewSkuRequest request)
    {
        var sku = await _dbContext.Skus.FirstOrDefaultAsync(s => s.Code == request.Code);

        if (sku != null)
            return BadRequest($"Já existe um sku com o código \"{request.Code}\" na lista de Skus");
        
        var newSku = new Sku
        {
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            RecipeId = null
        };

        await _dbContext.Skus.AddAsync(newSku);
        await _dbContext.SaveChangesAsync();
        return Ok($"{request.Name} foi adicionado à lista de Skus");
    }

    [HttpGet("get_skus")]
    public async Task<ActionResult<List<SkuDto>>> GetAllSkus()
    {
        var skus = await _dbContext.Skus.Select(s => new SkuDto(s.Code, s.Name, s.Description)).ToListAsync();
        
        return Ok(skus);
    }

    [HttpGet("get_sku")]
    public async Task<ActionResult<SkuDto>> GetSku([FromQuery] int id)
    {
        var sku = await _dbContext.Skus.FirstOrDefaultAsync(s => s.Id == id);

        if (sku == null)
            return BadRequest($"Não foi possível encontrar um sku com o id \"{id}\"");

        var dto = new SkuDto(sku.Code, sku.Name, sku.Description);
        return Ok(sku);
    }

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