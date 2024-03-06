using Microsoft.AspNetCore.Identity;
using ProjetoMateriasAble.Models.JoinTables;
using ProjetoMateriasAble.Models.Platform;

namespace ProjetoMateriasAble.Infra.User;

public class AppUser : IdentityUser
{
    public required string FullName { get; set; }
    public ICollection<UserNotification> Notifications { get; set; }
}