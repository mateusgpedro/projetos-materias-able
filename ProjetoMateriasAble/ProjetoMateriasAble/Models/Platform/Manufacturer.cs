namespace ProjetoMateriasAble.Models.Platform;

public class Manufacturer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<ManufacturerCodeRelation> ManufacturerCodeRelations { get; set; }
}