using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Infra.User;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;
using ProjetoMateriasAble.Services.Production;
using ProjetoMateriasAble.Services.Sku;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/production")]
public class ProductionController : ControllerBase
{
    private ApplicationDbContext _dbContext;
    private UserManager<AppUser> _userManager;
    private ISkuService _skuService;
    private IProductionService _productionService;
    
    public ProductionController(ApplicationDbContext dbContext, UserManager<AppUser> userManager, ISkuService skuService, IProductionService productionService)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _skuService = skuService;
        _productionService = productionService;
    }
    
    [HttpPost("add_production_plan")]
    public async Task<ActionResult> AddProductionPlan(AddProductionPlanRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.CreatedByUsername);
        if (user == null)
        {
            return BadRequest($"Não existe nenhum usuário com o nome {request.CreatedByUsername}");
        }

        var plan = new ProductionPlan
        {
            CreatedBy = request.CreatedByUsername,
            Start = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc),
            End = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc),
        };

        var existingPlan = await _dbContext.ProductionPlans.FirstOrDefaultAsync(e =>
            (e.Start <= plan.Start && e.End >= plan.Start) || (e.Start <= plan.End && e.End >= plan.End));
        if (existingPlan != null)
        {
            return BadRequest("Já existe um plano existente neste espaço de tempo");
        }

        List<ProductionOrder> productionOrders = new List<ProductionOrder>();
        if (request.ProductionOrders != null)
        {
            foreach (var item in request.ProductionOrders)
            {
                var skuResponse = await _skuService.GetSkuAsync(item.SkuId);
                if (skuResponse == null || !skuResponse.isSuccess || skuResponse.data == null)
                {
                    return BadRequest(skuResponse?.Errors);
                }

                var productionOrder = new ProductionOrder
                {
                    PlanId = plan.Id,
                    ProductionPlan = plan,
                    SkuId = item.SkuId,
                    Sku = skuResponse.data,
                    UnitiesToProduce = item.UnititesToProduce
                };
                productionOrders.Add(productionOrder);
            }

            foreach (var po in productionOrders)
            {
                await _dbContext.ProductionOrders.AddAsync(po);
            }

            plan.ProductionOrders = productionOrders;
        }

        await _dbContext.ProductionPlans.AddAsync(plan);
        await _dbContext.SaveChangesAsync();

        return Ok("Plano de produção criado");
    }

    
    [HttpPut("add_production_order")]
    public async Task<ActionResult> AddProductionOrderToPlan(AddProductionOrderToPlanRequest request)
    {
        var plan = await _dbContext.ProductionPlans.Include(pp => pp.ProductionOrders).FirstOrDefaultAsync(pp => pp.Id == request.PlanId);

        if (plan == null)
        {
            return BadRequest($"O plano com o ID {request.PlanId} não existe");
        }

        var skuResponse = await _skuService.GetSkuAsync(request.SkuId);

        if (!skuResponse.isSuccess)
        {
            return BadRequest(skuResponse.Errors);
        }

        if (plan.ProductionOrders == null)
        {
            plan.ProductionOrders = new List<ProductionOrder>();
        }

        // Check if there is an existing production order with the same SKU
        var productionOrder = plan.ProductionOrders.FirstOrDefault(po => (po.SkuId == (skuResponse.data?.Id)) && (po.PlanId == plan.Id));

        if (productionOrder != null)
        {
            // Update the UnitiesToProduce property of the existing production order
            productionOrder.UnitiesToProduce = request.UnitiesToProduce;
        }
        else
        {
            // Check if skuResponse.data is not null before accessing its properties
            if (skuResponse.data != null)
            {
                // Create a new production order and add it to the plan
                var newProductionOrder = new ProductionOrder
                {
                    PlanId = plan.Id,
                    ProductionPlan = plan,
                    Sku = skuResponse.data,
                    SkuId = skuResponse.data.Id,
                    UnitiesToProduce = request.UnitiesToProduce
                };

                plan.ProductionOrders.Add(newProductionOrder);
                _dbContext.ProductionOrders.Add(newProductionOrder);
            }
            else
            {
                // Handle the case where skuResponse.data is null (return an appropriate response or log an error)
                return BadRequest("Sku not found");
            }
        }

        await _dbContext.SaveChangesAsync();
        return Ok("Ordem de produção adicionada ao plano");
    }

    
    [HttpGet("get_production_orders")]
    public async Task<ActionResult<List<ProductionOrderDto>>> GetProductionOrdersFromPlan([FromQuery] int planId)
    {
        var plan = await _dbContext.ProductionPlans.Include(pp => pp.ProductionOrders).FirstOrDefaultAsync(pp => pp.Id == planId);
        if (plan == null)
        {
            return BadRequest($"O plano com o ID {planId} não existe");
        }

        if (plan.ProductionOrders == null)
        {
            // Handle the case where ProductionOrders is null (return an empty list or appropriate response)
            return Ok(new List<ProductionOrderDto>());
        }

        var productionOrders = await _dbContext.ProductionOrders
            .Include(po => po.ProductionPlan)
            .Include(po => po.Sku)
            .Where(po => po.PlanId == planId)
            .Select(po => new ProductionOrderDto(po.Id, po.UnitiesToProduce, po.SkuId, po.Sku.Name)).ToListAsync();
        
        return Ok(productionOrders);
    }


    [HttpGet("get_required_materials")]
    public async Task<ActionResult<List<RequiredMaterialsDto>>> GetRequiredMaterials([FromQuery] int planId)
    {
        var plan = await _dbContext.ProductionPlans.FirstOrDefaultAsync(pp => pp.Id == planId);
        if (plan == null)
            return BadRequest($"O plano com o ID {planId} não existe");

        var required = await _productionService.GetRequiredMaterials(planId);
        return Ok(required.data);
    }
}