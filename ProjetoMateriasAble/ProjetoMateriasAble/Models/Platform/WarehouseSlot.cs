namespace ProjetoMateriasAble.Models.Platform;

public class WarehouseSlot
{
    public int WarehouseSlotId { get; set; } 
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; }
    public int? MaterialId { get; set; }
    public Material? Material { get; set; }
    public char Column { get; set; }
    public int Row { get; set; }
    public int Unidades { get; set; }
}