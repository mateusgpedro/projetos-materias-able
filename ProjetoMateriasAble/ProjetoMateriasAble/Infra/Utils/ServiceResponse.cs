namespace ProjetoMateriasAble.Infra.Utils;

public class ServiceResponse
{
    public bool isSuccess { get; set; }
    public List<string>? Errors { get; set; } = new List<string>();
}

public class ServiceResponse<T> : ServiceResponse
{
    public T? data { get; set; }
}