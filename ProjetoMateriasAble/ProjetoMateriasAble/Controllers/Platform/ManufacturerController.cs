using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;
using ProjetoMateriasAble.Services.Manufacturers;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/manufacturer")]
public class ManufacturerController : ControllerBase
{
    private ApplicationDbContext _dbContext;
    private IManufacturerService _manufacturerService;

    public ManufacturerController(ApplicationDbContext dbContext, IManufacturerService manufacturerService)
    {
        _dbContext = dbContext;
        _manufacturerService = manufacturerService;
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Dev,Chefia,Admin")]
    [HttpPost("add")]
    public async Task<ActionResult> CreateManufacturer(NewManufacturerRequest request)
    {
        var manufacturer = new Manufacturer()
        {
            Name = request.Name
        };

        await _dbContext.Manufacturers.AddAsync(manufacturer);
        await _dbContext.SaveChangesAsync();
        return Ok();
    }
    
    [HttpGet("get_manufacturers")]
    public async Task<ActionResult<List<ManufacturersDto>>> GetManufacturers()
    {
        var response = await _manufacturerService.GetAllManufacturersAsync();
        
        return Ok(response.data);
    }
}