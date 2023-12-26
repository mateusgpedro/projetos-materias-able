namespace ProjetoMateriasAble.RequestsDtos.Requests.Platform;

public record CreateRecipeRequest(int SkuId, Dictionary<int, int> DictionaryData);