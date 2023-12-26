namespace ProjetoMateriasAble.Infra.Utils;

public class ServiceResponse<T>
{
    public T? data;

    public bool isSuccess = false;

    public List<String>? Errors;
}