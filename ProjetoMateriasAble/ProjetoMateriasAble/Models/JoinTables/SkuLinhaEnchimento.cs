using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Models.JoinTables;

public class SkuLinhaEnchimento
{
    public int SkuId { get; set; }
    public Sku Sku { get; set; }
    
    public int LinhaDeEnchimentoId { get; set; }
    public LinhaDeEnchimento LinhaDeEnchimento { get; set; }
}