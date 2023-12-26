using Microsoft.AspNetCore.Identity;

namespace ProjetoMateriasAble.Infra.User;

public class AppUser : IdentityUser
{
    public required string FullName { get; set; }
}