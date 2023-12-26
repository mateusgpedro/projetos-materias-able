using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/materials")]
public class MaterialsController : ControllerBase
{
    private ApplicationDbContext _dbContext;

    public MaterialsController(ApplicationDbContext context)
    {
        _dbContext = context;
    }
    
    [HttpPost("add")]
    public async Task<ActionResult<string>> AddMaterial(NewMaterialRequest request)
    {
        var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Code == request.Code);
        if (material != null)
            return BadRequest($"O material com o código {request.Code} já existe");
        
        Material newMaterial = new Material
        {
            Name = request.Name,
            Code = request.Code
        };
        await _dbContext.Materials.AddAsync(newMaterial);
        await _dbContext.SaveChangesAsync();
        return Ok("Material Adicionado");
    }

    [HttpGet("get_material")]
    public async Task<ActionResult<MaterialDto>> GetMaterial([FromQuery] int materialId)
    {
        var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Id == materialId);

        if (material == null)
            return BadRequest("No material with such Id was found");
        
        MaterialDto dto = new MaterialDto(material.Id, material.Name, material.Amount, material.PositionsCount);
        return Ok(dto);
    }

    [HttpGet("get_all_materials")]
    public async Task<ActionResult<List<MaterialDto>>> GetAllMaterials()
    {
        var materialDtos = await _dbContext.Materials.Select(m => new MaterialDto(m.Id, m.Name, m.Amount, m.PositionsCount)).ToListAsync();
            
        return Ok(materialDtos);
    }

    [HttpDelete("remove_material")]
    public async Task<ActionResult<string>> RemoveMaterial(int id)
    {
        var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Id == id);
        if (material == null)
            return BadRequest($"Nenhum material com o id \"{id}\" foi encontrado");

        _dbContext.Materials.Remove(material);
        await _dbContext.SaveChangesAsync();
        return Ok();
    }
}