using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoMateriasAble.Models.Platform;

public class Material
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public int Amount { get; set; }
    public int PositionsCount { get; set; }
    public int Quebra { get; set; }
    public int StockSeguranca { get; set; }
    public string Cost { get; set; }
    public string Type { get; set; }
    public string ManufacturerCode { get; set; }
    public bool Approved { get; set; }
    public ICollection<WarehouseSlot> WarehouseSlots { get; set; }
}