namespace ProjetoMateriasAble.Models.Platform;

public record NewSkuRequest(string Code, string Name, Dictionary<int, int>? MaterialsData, List<int> LinhasDeEnchimento);