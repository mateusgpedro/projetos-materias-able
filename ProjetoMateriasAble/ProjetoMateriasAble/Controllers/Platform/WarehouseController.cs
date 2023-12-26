using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using ProjetoMateriasAble.DTOs;
using ProjetoMateriasAble.Infra;
using ProjetoMateriasAble.Models.Platform;
using ProjetoMateriasAble.RequestsDtos.Requests;
using ProjetoMateriasAble.RequestsDtos.Requests.Platform;

namespace ProjetoMateriasAble.Controllers.Platform;

[ApiController]
[Route("api/warehouse")]
public class WarehouseController : ControllerBase
{
    private ApplicationDbContext _dbContext;

    public WarehouseController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("add_warehouse")]
    public async Task<ActionResult> AddWarehouse(WarehouseRequest request)
    {
        var warehouse = await _dbContext.Warehouses.FirstOrDefaultAsync(w => w.Letter == request.Letter);

        if (warehouse != null)
            return BadRequest($"O armazém \"{request.Letter}\" já existe.");

        var newWarehouse = new Warehouse()
        {
            Letter = request.Letter
        };
        await _dbContext.Warehouses.AddAsync(newWarehouse);
        await _dbContext.SaveChangesAsync();
        return Ok($"O armazém \"{request.Letter}\" foi criado");
    }

    [HttpPost("add_slot")]
    public async Task<ActionResult> AddWarehouseSlot(WarehouseSlotRequest request)
    {
        var existingSlot = await _dbContext.WarehouseSlots
            .FirstOrDefaultAsync(ws => ws.Row == request.Row
                                       && ws.Column == request.Column
                                       && ws.Warehouse.Letter == request.WarehouseLetter);

        if (existingSlot != null)
            return BadRequest(
                $"A posição {request.Column}{request.Row} já foi criada no armazém \"{request.WarehouseLetter}\"");

        var warehouse = await _dbContext.Warehouses.FirstOrDefaultAsync(w => w.Letter == request.WarehouseLetter);
        if (warehouse == null)
            BadRequest($"O armazém \"{request.WarehouseLetter}\" não foi encontrado");

        var slot = new WarehouseSlot()
        {
            Column = request.Column,
            Row = request.Row,
            Material = null,
            MaterialId = null,
            Unidades = 0,
            Warehouse = warehouse,
            WarehouseId = warehouse.Id
        };

        if (warehouse.WarehouseSlots.IsNullOrEmpty())
            warehouse.WarehouseSlots = new List<WarehouseSlot>();

        warehouse.WarehouseSlots.Add(slot);
        await _dbContext.WarehouseSlots.AddAsync(slot);
        await _dbContext.SaveChangesAsync();
        return Ok($"A posição {request.Column}{request.Row} foi adicionado ao armazém \"{warehouse.Letter}\".");
    }

    [HttpPut("add_material_slot")]
    public async Task<ActionResult> AddMaterialToSlot(AddMaterialToSlotRequest request)
    {
        var slot = await _dbContext.WarehouseSlots.Include(ws => ws.Material)
            .FirstOrDefaultAsync(ws => ws.WarehouseSlotId == request.SlotId);
        if (slot == null)
            return BadRequest($"A posição com o id {request.SlotId} não foi encontrado");
        if (request.MaterialId.HasValue)
        {
            var material = await _dbContext.Materials.FirstOrDefaultAsync(m => m.Id == request.MaterialId);
            if (material == null)
                return BadRequest($"O material com o id {request.MaterialId} não foi encontrado");

            if (material != null && slot.Material != null && material != slot.Material)
                return BadRequest($"Um material diferente já existe na posição {slot.Column}{slot.Row}");
            else if (material != null && slot.Material != null && material == slot.Material)
                slot.Unidades += request.Amount;
            else if (slot.Material == null)
            {
                slot.MaterialId = material.Id;
                slot.Material = material;
                slot.Unidades += request.Amount;
            }

            material.Amount += request.Amount;

            await _dbContext.SaveChangesAsync();
            return Ok(
                $"Foram adicionadas {request.Amount} unidades de {material.Name} à posição {slot.Column}{slot.Row}");
        }
        else
        {
            if (slot.Material == null)
                return BadRequest(
                    $"Não foi encontrado nenhum material associado com a posição {slot.Column}{slot.Row}");
            slot.Unidades += request.Amount;
            slot.Material.Amount += request.Amount;

            await _dbContext.SaveChangesAsync();
            return Ok(
                $"Foram adicionadas {request.Amount} unidades de {slot.Material.Name} à  posição {slot.Column}{slot.Row}");
        }
    }

    [HttpPut("remove_material_slot")]
    public async Task<ActionResult> RemoveMaterialToSlot(RemoveMaterialToSlotRequest request)
    {
        var slot = await _dbContext.WarehouseSlots.Include(ws => ws.Material)
            .FirstOrDefaultAsync(ws => ws.WarehouseSlotId == request.SlotId);

        if (slot == null)
            return BadRequest($"A posição com o id {request.SlotId} não foi encontrado");

        if (slot.Material == null)
            return BadRequest($"Não foi encontrado nenhum material associado com a posição {slot.Column}{slot.Row}");

        if (request.Amount > slot.Unidades)
            return BadRequest($"Não foi possível remover {request.Amount} " +
                              $"unidades da posição {slot.Column}{slot.Row}, " +
                              $"pois esta tem menos unidades do que a quantidade requesitada");

        var slotMaterialName = slot.Material.Name;
        slot.Unidades -= request.Amount;

        // Check if slot.Material is not null before updating the Amount property
        if (slot.Material != null)
        {
            slot.Material.Amount -= request.Amount;

            if (slot.Unidades == 0)
            {
                slot.Material = null;
                slot.MaterialId = null;
            }
        }

        await _dbContext.SaveChangesAsync();
        return Ok(
            $"Foram removidas {request.Amount} unidades de {slotMaterialName} da posição {slot.Column}{slot.Row}");
    }

    [HttpGet("get_slot_info")]
    public async Task<ActionResult<SlotInfoDto>> GetSlotInfo(int id)
    {
        var slot = await _dbContext.WarehouseSlots.FirstOrDefaultAsync(ws => ws.WarehouseSlotId == id);
        if (slot == null)
            return BadRequest();
        var dto = new SlotInfoDto(slot.MaterialId, slot.Column, slot.Row, slot.Unidades, slot.WarehouseId);
        return Ok(dto);
    }

    [HttpGet("get_all_slots")]
    public async Task<ActionResult<List<SlotInfoDto>>> GetAllSlots()
    {
        var list = await _dbContext.WarehouseSlots.Select(ws =>
            new SlotInfoDto(ws.MaterialId, ws.Column, ws.Row, ws.Unidades, ws.WarehouseId)).ToListAsync();
        return Ok(list);
    }
}