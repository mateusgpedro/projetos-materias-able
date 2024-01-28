using ProjetoMateriasAble.Models.JoinTables;

namespace ProjetoMateriasAble.Models.Platform;

public class LinhaDeEnchimento
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<SkuLinhaEnchimento> SkusLinhasDeEnchimento { get; set; }
}