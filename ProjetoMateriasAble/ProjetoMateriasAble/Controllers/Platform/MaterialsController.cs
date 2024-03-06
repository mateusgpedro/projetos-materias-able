using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Hubs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.JoinTables;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.DTOs;
using ProjetoMateriasAble.Services;
using ProjetoMateriasAble.Services.Manufacturers;
using ProjetoMateriasAble.Services.Recipes;
using ProjetoMateriasAble.Utils;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/materials")]
public class MaterialsController : ControllerBase
{
    private ApplicationDbContext _dbContext;
    private IMyAuthorizationService _authorizationService;
    private IManufacturerService _manufacturerService;
    private IRecipeService _recipeService;
    private UserManager<AppUser> _userManager;
    private IHubContext<NotificationHub> _hubContext;
    
    public MaterialsController(ApplicationDbContext context, IMyAuthorizationService authorizationService, IManufacturerService manufacturerService, IRecipeService recipeService, UserManager<AppUser> userManager, IHubContext<NotificationHub> hubContext)
    {
        _dbContext = context;
        _authorizationService = authorizationService;
        _manufacturerService = manufacturerService;
        _recipeService = recipeService;
        _userManager = userManager;
        _hubContext = hubContext;
    }
    
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Dev,Chefia,Admin")]
    [HttpPost("add")]
    public async Task<ActionResult<string>> AddMaterial(NewMaterialRequest request)
    {
        var users = await _userManager.GetUsersInRoleAsync("Chefia");

        using (var transaction = await _dbContext.Database.BeginTransactionAsync())
        {
            try
            {
                var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Name == request.Name && m.Type == request.Type);
                if (material != null)
                    return BadRequest($"O material com o nome {request.Name} já existe");
                
                int stockSeguranca;
                if (!int.TryParse(request.StockSeguranca.Trim(), out stockSeguranca))
                {
                    return BadRequest($"Stock de seguranca \"{request.EstimatedValue}\" não é um número válido");
                }

                decimal estimatedValue;
                if (!decimal.TryParse(request.EstimatedValue.Trim(), out estimatedValue))
                {
                    return BadRequest($"Stock de seguranca \"{request.EstimatedValue}\" não é um número válido");
                }
                
                Material newMaterial = new Material
                {
                    Name = request.Name,
                    Type = request.Type,
                    Code = "123",
                    StockSeguranca = stockSeguranca,
                    Cost = estimatedValue,
                    Approved = _authorizationService.HasRoleAsync("Chefia"), 
                };
                
                await _dbContext.Materials.AddAsync(newMaterial); 
                
                foreach (var item in request.Manufacturers)
                {
                    int manufacturerId;

                    if (item.ManufacturerId == null)
                    {
                        return BadRequest("manufacturerId null");
                    }
                    Console.WriteLine($"Manufacturer ID: {item.ManufacturerId}");
                    if (!int.TryParse(item.ManufacturerId.Trim(), out manufacturerId))
                    {
                        return BadRequest($"Fabricante com o Id {item.ManufacturerId} não é um número válido");
                    }
                    
                    Console.WriteLine($"Manufacturer ID: {manufacturerId}");
                    
                    var manufacturerResponse = await _manufacturerService.GetManufacturerAsync(manufacturerId);
                    
                    if (!manufacturerResponse.isSuccess)
                    {
                        return BadRequest(manufacturerResponse.Errors);
                    }
                
                    var manufacturerCodeRelation = new ManufacturerCodeRelation
                    {
                        Code = item.ManufacturerCode,
                        ManufacturerId = 1,
                        Manufacturer = manufacturerResponse.data,
                        MaterialId = newMaterial.Id,
                        Material = newMaterial
                    };
                    
                    await _dbContext.ManufacturerCodeRelations.AddAsync(manufacturerCodeRelation);
                    newMaterial.ManufacturerCodeRelations.Add(manufacturerCodeRelation);
                    manufacturerResponse.data.ManufacturerCodeRelations.Add(manufacturerCodeRelation);
                }
                await _dbContext.SaveChangesAsync();

                if (request.SkuCodesAmounts != null && request.Type == "producao")
                {
                    foreach (var item in request.SkuCodesAmounts)
                    {
                        var response = await _recipeService.AddMaterialToRecipeAsync(item.SkuCode, newMaterial, item.Amount);

                        if (!response.isSuccess)
                            return BadRequest(response.Errors);
                    }
                    
                }
                
                var sender = HttpContext.User.FindFirstValue("Fullname");
                Console.WriteLine(sender);
                
                if (!_authorizationService.HasRoleAsync("Chefia"))
                {
                    var newNotification = new Notification()
                    {
                        NotificationTitle = "Novo material",
                        NotificationMessage = "Pedido para aprovar material criado.",
                        SenderUsername = sender,
                        SendTime = DateTime.UtcNow,
                        Url = $"/{(request.Type == "producao" ? "materiais_producao" : "materiais_manutencao")}/pedido?m={newMaterial.Id}",
                        Receivers = new List<UserNotification>()
                    };
                    
                    foreach (var user in users)
                    {
                        var newNotificationUser = new UserNotification()
                        {
                            Notification = newNotification,
                            UserId = user.Id
                        };

                        await _dbContext.UserNotificationsJoinTable.AddAsync(newNotificationUser);
                        user.Notifications.Add(newNotificationUser);
                        newNotification.Receivers.Add(newNotificationUser);
                    }

                    await _dbContext.SaveChangesAsync();
                }
                
                await transaction.CommitAsync();

                if (!_authorizationService.HasRoleAsync("Chefia"))
                {
                    foreach (var user in users)
                    {
                        await _hubContext.Clients.Group(user.Id)
                            .SendAsync("ReceiveNotification", 
                                "Pedido para aprovar material.", 
                                $"/{(request.Type == "producao" ? "materiais_producao" : "materiais_manutencao")}/pedido?m={newMaterial.Id}");
                    }
                }
                
                return Ok("Material Adicionado");
            }
            catch (Exception e)
            {
                transaction.Rollback();
                return StatusCode(500, $"Erro interno: {e.Message} \n {e.InnerException}");
            }
        }
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Dev,Chefia,Admin")]
    [HttpGet("confirm_existence")]
    public async Task<ActionResult<NewMaterialErrorsDto>> ConfirmMaterialExistence([FromQuery] string materialName, [FromQuery] string materialType)
    {
        var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Name == materialName && m.Type == materialType);

        if (material == null)
        {
            return Ok(new NewMaterialErrorsDto(""));
        }
        else
        {
            return Ok(new NewMaterialErrorsDto("Nome de material já existe."));
        }
    }
    
    [HttpGet("get_material")]
    public async Task<ActionResult<MaterialDto>> GetMaterial([FromQuery] string materialCode)
    {
        var material = await _dbContext.Materials
            .Include(m => m.ManufacturerCodeRelations)
            .ThenInclude(m => m.Manufacturer)
            .FirstOrDefaultAsync(m => m.Code == materialCode);

        if (material == null)
            return BadRequest("No material with such Id was found");
        
        MaterialDto dto = 
            new MaterialDto
                (material.Id, material.Code,material.Name, material.Cost.ToString(), material.ManufacturerCodeRelations
                    .Where(m => m.MaterialId == material.Id)
                    .Select(mcr => new ManufacturersDto(mcr.ManufacturerId.ToString(), mcr.Manufacturer.Name))
                    .ToList());
        return Ok(dto);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("search_materials")]
    public async Task<ActionResult<ListMaterialDto>> GetFilteredMaterials([FromQuery] string? searchString, [FromQuery] int searchType, 
        [FromQuery] string materialType, [FromQuery] int page, [FromQuery] int pageSize)
    {
        var filteredMaterials = await _dbContext.Materials
            .Include(m => m.ManufacturerCodeRelations)
            .ThenInclude(m => m.Manufacturer)
            .Where(m => m.Type == materialType)
            .Where(m => m.Approved == true)
            .ToListAsync();

        if (searchType == 0)
        {
            filteredMaterials = filteredMaterials
                .Where(m => Diacritics.RemoveDiacritics(m.Name).Contains(Diacritics.RemoveDiacritics(searchString)))
                .ToList();
        } else if (searchType == 1)
        {
            filteredMaterials = filteredMaterials.Where(m => m.ManufacturerCodeRelations
                    .Any(m => m.Code == searchString))
                    .ToList();
        }
        
        int pagesCount;
        List<MaterialDto> materialsList;
        if (pageSize == 0)
        {
            materialsList = filteredMaterials
                .Select(m => 
                    new MaterialDto(m.Id, m.Code,m.Name,  m.Cost.ToString(), 
                        m.ManufacturerCodeRelations
                            .Where(mcr => mcr.MaterialId == m.Id)
                            .Select(mcr => new ManufacturersDto(mcr.ManufacturerId.ToString(), mcr.Manufacturer.Name))
                            .ToList()))
                .ToList();
            
            pagesCount = 0;
        }
        else
        {
            materialsList = filteredMaterials
                .Select(m => 
                    new MaterialDto(m.Id, m.Code,m.Name,  m.Cost.ToString(), 
                        m.ManufacturerCodeRelations
                            .Where(mcr => mcr.MaterialId == m.Id)
                            .Select(mcr => new ManufacturersDto(mcr.ManufacturerId.ToString(), mcr.Manufacturer.Name))
                            .ToList()))
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            
            pagesCount = filteredMaterials.Count / pageSize;
        }

        var response = new ListMaterialDto(materialsList, pagesCount + 1);
        return Ok(response);
    }
    
    [HttpGet("get_all_materials")]
    public async Task<ActionResult<List<MaterialDto>>> GetAllMaterials()
    {
        var materialDtos = await _dbContext.Materials
            .Include(m => m.ManufacturerCodeRelations)
            .ThenInclude(m => m.Manufacturer)
            .Select(m => 
                new MaterialDto(m.Id, m.Code,m.Name,  m.Cost.ToString(), 
                    m.ManufacturerCodeRelations
                        .Where(mcr => mcr.MaterialId == m.Id)
                        .Select(mcr => new ManufacturersDto(mcr.ManufacturerId.ToString(), mcr.Manufacturer.Name))
                        .ToList()))
            .ToListAsync();
            
        return Ok(materialDtos);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Chefia,Dev")]
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

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Chefia,Dev")]
    [HttpGet("get_unapproved")]
    public async Task<ActionResult> GetUnapprovedMaterialInfo([FromQuery] int materialId)
    {
        var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Id == materialId);
        if (material == null)
        {
            return BadRequest($"Não foi possível encontrar o material com o ID {materialId}");
        }

        var manufacturers = await _dbContext.ManufacturerCodeRelations
            .Where(mcr => mcr.MaterialId == materialId)
            .Include(mcr => mcr.Manufacturer)
            .Select(m => new ManufacturersList(m.Manufacturer.Name, m.Code))
            .ToListAsync();
        
        var recipes = await _dbContext.RecipeMaterialsAmounts
            .Where(r => r.MaterialId == materialId)
            .Include(m => m.Recipe)
            .ThenInclude(r => r.Sku)
            .Select(r => new RecipesList(r.Recipe.Sku.Name, r.Amount))
            .ToListAsync();

        var dto = new UnapprovedMaterialDTO(material.Name, material.StockSeguranca, material.Cost, manufacturers,
            recipes);
        return Ok(dto);
    }
}