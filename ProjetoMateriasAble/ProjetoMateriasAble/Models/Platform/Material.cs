using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoMateriasAble.Models.Platform;

public class Material
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Amount { get; set; }
    public int PositionsCount { get; set; }
    public string Code { get; set; }
    
    public ICollection<WarehouseSlot> WarehouseSlots { get; set; }
}