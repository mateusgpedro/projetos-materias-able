using ProjetoMateriasAble.Models.JoinTables;

namespace ProjetoMateriasAble.Models.Platform;

public class Recipe
{
    public int Id { get; set; }
    public int SkuId { get; set; }
    public Sku Sku { get; set; }
    public ICollection<RecipeMaterialsAmount> RecipeMaterialsAmounts { get; set; }
}