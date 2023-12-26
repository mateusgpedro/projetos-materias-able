using Microsoft.AspNetCore.Identity;

namespace ProjetoMateriasAble.Utils;

public static class ConvertToProblemDetailsExtension
{
    public static List<string> ConvertToProblemDetails(this IEnumerable<IdentityError> error)
    {
        List<IdentityError> errorList = error.ToList();
        var errors = errorList.Select(e => e.Description).ToList();
        return errors;
    }
}