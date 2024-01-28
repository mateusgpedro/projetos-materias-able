using ProjetoMateriasAble.Models.JoinTables;

namespace ProjetoMateriasAble.Models.Platform;

public class Sku
{
    public int Id { get; set; }
    public string Code { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; }
    public int RecipeId { get; set; }
    public Recipe?  Recipe { get; set; }
    public ICollection<SkuLinhaEnchimento> SkusLinhasDeEnchimento { get; set; }
}