using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.Utils;

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
    
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Dev,Chefia,Admin")]
    [HttpPost("add")]
    public async Task<ActionResult<string>> AddMaterial(NewMaterialRequest request)
    {
        var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Name == request.Name);
        if (material != null)
            return BadRequest($"O material com o nome {request.Name} já existe");

        var roles = HttpContext.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        var manufacturerCodeRelations = request.Manufacturers
            .Select(m => new ManufacturerCodeRelation() { });
        
        var shouldApprove = roles.Any(r => r == "Chefia");
        Material newMaterial = new Material
        {
            Name = request.Name,
            Type = request.Type,
            Code = "123",
            StockSeguranca = request.StockSeguranca,
            Cost = request.EstimatedValue,
            Approved = false, 
        };
        
        await _dbContext.Materials.AddAsync(newMaterial);
        await _dbContext.SaveChangesAsync();
        return Ok("Material Adicionado");
    }
    
    [HttpGet("get_material")]
    public async Task<ActionResult<MaterialDto>> GetMaterial([FromQuery] string materialCode)
    {
        var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Code == materialCode);

        if (material == null)
            return BadRequest("No material with such Id was found");
        
        MaterialDto dto = new MaterialDto(material.Id, material.Code,material.Name, material.Amount, material.Cost);
        return Ok(dto);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Dev")]
    [HttpGet("search_materials")]
    public async Task<ActionResult<List<MaterialDto>>> GetFilteredMaterials([FromQuery] string searchString, [FromQuery] int searchType, [FromQuery] string materialType)
    {
        var filteredMaterials = await _dbContext.Materials
            .Where(m => m.Type == materialType)
            .Where(m => m.Approved == true)
            .ToListAsync();

        if (searchType == 0)
        {
            filteredMaterials = filteredMaterials
                .Where(m => Diacritics.RemoveDiacritics(m.Name).Contains(Diacritics.RemoveDiacritics(searchString)))
                .ToList();
        }

        // if (searchType == 1)
        // {
        //     filteredMaterials = filteredMaterials.Where(m => m.ManufacturerCode == searchString).ToList();
        // }

        var materialsList = filteredMaterials.Select(m => new MaterialDto(m.Id, m.Code,m.Name, m.Amount,  m.Cost)).ToList();
        return Ok(materialsList);
    }
    
    [HttpGet("get_all_materials")]
    public async Task<ActionResult<List<MaterialDto>>> GetAllMaterials()
    {
        var materialDtos = await _dbContext.Materials
            .Select(m => new MaterialDto(m.Id, m.Code, m.Name, m.Amount,  m.Cost))
            .ToListAsync();
            
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